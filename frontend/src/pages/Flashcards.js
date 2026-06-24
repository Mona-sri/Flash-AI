import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FlashcardList from '../components/FlashcardList';
import QuizMode from '../components/QuizMode';
import './Flashcards.css';

export default function Flashcards() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { saveDeck, deleteDeck, isDeckSaved } = useContext(AuthContext);

  const deck = location.state?.deck;

  const [quizMode,  setQuizMode]  = useState(false);
  const [saved,     setSaved]     = useState(deck ? isDeckSaved(deck.id) : false);
  const [saveMsg,   setSaveMsg]   = useState('');

  if (!deck) {
    return (
      <div className="fc-page no-deck">
        <span>📭</span>
        <h2>No flashcards loaded</h2>
        <p>Go back and generate a deck first.</p>
        <button className="btn-go-gen" onClick={() => navigate('/generate')}>
          Generate flashcards →
        </button>
      </div>
    );
  }

  const handleSaveToggle = () => {
    if (saved) {
      deleteDeck(deck.id);
      setSaved(false);
      setSaveMsg('Deck removed from saved.');
    } else {
      saveDeck(deck);
      setSaved(true);
      setSaveMsg('Deck saved! ✓');
    }
    setTimeout(() => setSaveMsg(''), 2500);
  };

  const diffColor = {
    easy:   '#22c87a',
    medium: '#6c63ff',
    hard:   '#ff6584',
  }[deck.difficulty] || '#6c63ff';

  if (quizMode) {
    return (
      <div className="fc-page">
        <QuizMode cards={deck.cards} onExit={() => setQuizMode(false)} />
      </div>
    );
  }

  return (
    <div className="fc-page">
      <div className="fc-container">

        {/* ── Deck header ── */}
        <div className="deck-header">
          <button className="btn-back" onClick={() => navigate('/generate')}>
            ← Generate new
          </button>

          <div className="deck-meta">
            <div className="deck-title-row">
              <h1 className="deck-title">{deck.title}</h1>
              <span className="diff-chip" style={{ background: diffColor + '22', color: diffColor }}>
                {deck.difficulty}
              </span>
            </div>
            <p className="deck-info">{deck.cards.length} cards · generated {new Date(deck.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="deck-actions">
            <button
              className={`btn-save ${saved ? 'saved' : ''}`}
              onClick={handleSaveToggle}
              title={saved ? 'Remove from saved' : 'Save deck'}
            >
              {saved ? '💾 Saved' : '🔖 Save deck'}
            </button>
            <button className="btn-quiz" onClick={() => setQuizMode(true)}>
              🧠 Quiz mode
            </button>
          </div>
        </div>

        {saveMsg && (
          <div className="save-toast">{saveMsg}</div>
        )}

        {/* ── Flip instruction ── */}
        <div className="flip-tip">
          💡 Click any card to flip it — question on front, answer on back
        </div>

        {/* ── Cards ── */}
        <FlashcardList cards={deck.cards} />

      </div>
    </div>
  );
}