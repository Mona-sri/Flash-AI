import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import multer from 'multer';
import { createRequire } from 'module';
import connectDB from './db.js';
import User from './User.js';
import Deck from './Deck.js';
import bcrypt from 'bcrypt';

const require = createRequire(import.meta.url);
let pdfModule = require('pdf-parse');
const pdf = (typeof pdfModule === 'function') ? pdfModule : pdfModule.default;
const app = express();
const upload = multer();

// app.use(cors()); 
// const cors = require('cors');
app.use(cors({
  origin: 'https://flash-ai-rryh.onrender.com', 
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash"; 
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

connectDB();

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password.' });

    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/decks/save', async (req, res) => {
  try {
    const { title, difficulty, cards, userId } = req.body;
    const newDeck = new Deck({ title, difficulty, cards, userId });
    await newDeck.save();
    res.status(201).json(newDeck);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save deck' });
  }
});

app.get('/api/decks/:userId', async (req, res) => {
  const decks = await Deck.find({ userId: req.params.userId });
  res.json(decks);
});

app.delete('/api/decks/:id', async (req, res) => {
  try {
    await Deck.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deck deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete deck' });
  }
});

app.post('/api/generate-flashcards', upload.single('file'), async (req, res) => {
  try {
    let textToProcess = req.body.text || '';
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const data = await pdf(req.file.buffer);
        textToProcess = data.text;
      } else {
        textToProcess = req.file.buffer.toString('utf-8');
      }
    }

    if (!textToProcess || textToProcess.trim().length < 50) {
      return res.status(400).json({ error: 'Text is too short or missing.' });
    }
    const { text, difficulty = 'medium', count = 10 } = req.body;
    
    if (!GEMINI_API_KEY) {
      console.error("CRITICAL: GEMINI_API_KEY is missing from .env");
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    // const diffGuide = {
      // easy: 'simple factual recall — one clear, short answer per card',
      // medium: 'conceptual understanding — answers may need a sentence or two',
      // hard: 'deep analysis or inference — questions should be more specific which need in depth topic knowledge and require thorough explanation in 3 sentences',
    // };
    const difficultyRules = {
      easy: "Question: Simple factual recall. Answer: Must be a single word or a short phrase.",
      medium: "Question: Conceptual questions testing understanding. Answer: Must be exactly one sentence.",
      hard: "Question: Specific, deep analytical questions. Answer: Must be exactly two sentences that explain the topic clearly."
    };

    const systemInstruction = `You are an expert educator. Return ONLY a JSON object with a single key "cards" which is an array of objects.
     Each object must have "question" and "answer" keys. Difficulty: ${difficulty} — ${difficultyRules[difficulty]}. 
     NO markdown, NO code fences, NO conversational text.Do not repeat the question inside the answer field.
     The "answer" key must contain ONLY the concise answer.NEVER start the answer with the term being defined or any word from the question`;

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: `Create ${count} flashcards from this text:\n\n${textToProcess}` }] }],
        generationConfig: { 
          responseMimeType: "application/json",
          temperature: 0.4
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", JSON.stringify(data, null, 2));
      return res.status(response.status).json({ error: 'Gemini API call failed', details: data });
    }

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) {
      console.error("Gemini returned no text content:", JSON.stringify(data, null, 2));
      return res.status(500).json({ error: 'API returned empty content' });
    }

    const cleanJson = raw.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    const cardsArray = parsedData.cards || [];
    const formattedCards = cardsArray
      .map((c, i) => ({
        id: `card-${Date.now()}-${i}`,
        question: String(c.question || '').trim(),
        answer: String(c.answer || '').trim(),
      }))
      .filter(c => c.question && c.answer);

    return res.json(formattedCards);

  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Gemini-powered server running on port ${PORT}`));
