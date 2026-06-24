import mongoose from 'mongoose';

const DeckSchema = new mongoose.Schema({
  title: String,
  difficulty: String,
  cards: [{ question: String, answer: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Deck', DeckSchema);