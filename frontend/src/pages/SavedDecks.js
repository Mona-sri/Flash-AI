import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import QuizMode from '../components/QuizMode';
import FlashcardList from '../components/FlashcardList';
import './SavedDecks.css';

export default function SavedDecks() {
  const { savedDecks, deleteDeck } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeMode, setActiveMode]  = useState(null);  
  const [activeDeck, setActiveDeck]  = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm]  = useState('');

  const filtered = savedDecks.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openBrowse = (deck) => { setActiveDeck(deck); setActiveMode('browse'); };
  const openQuiz   = (deck) => { setActiveDeck(deck); setActiveMode('quiz'); };
  const closeMode  = ()     => { setActiveDeck(null); setActiveMode(null); };
  
  const handleDelete = async (id) => {
  try {
    await fetch(`http://localhost:5000/api/decks/${id}`, { method: 'DELETE' });
    deleteDeck(id); 
    setDeleteConfirm(null);
    if (activeDeck?.id === id) closeMode();
    } catch (err) {
    console.error("Delete failed:", err);
    alert("Could not delete deck. Please try again.");
    }
  };
  const diffColor = (d) => ({ easy: '#22c87a', medium: '#6c63ff', hard: '#ff6584' }[d] || '#6c63ff');
  const timeAgo = (iso) => {
    const mins  = Math.floor((Date.now() - new Date(iso)) / 60000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    if (mins < 1)   return 'just now';
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (activeMode === 'quiz' && activeDeck) {
    return (
      <div className="sd-page">
        <QuizMode cards={activeDeck.cards} onExit={closeMode} />
      </div>
    );
  }

  if (activeMode === 'browse' && activeDeck) {
    return (
      <div className="sd-page">
        <div className="sd-browse-container">
          <div className="sd-browse-header">
            <button className="btn-back-sd" onClick={closeMode}>← Back to saved</button>
            <h2 className="browse-title">{activeDeck.title}</h2>
            <div className="browse-actions">
              <button className="btn-quiz-sm" onClick={() => setActiveMode('quiz')}>
                🧠 Quiz mode
              </button>
            </div>
          </div>
          <div className="flip-tip-sm">💡 Click any card to reveal the answer</div>
          <FlashcardList cards={activeDeck.cards} />
        </div>
      </div>
    );
  }

  return (
    <div className="sd-page">
      <div className="sd-container">

        {/* Header */}
        <div className="sd-header">
          <div>
            <h1>Saved Decks</h1>
            <p>{savedDecks.length} deck{savedDecks.length !== 1 ? 's' : ''} saved</p>
          </div>
          <button className="btn-generate-new" onClick={() => navigate('/generate')}>
            + Generate new
          </button>
        </div>

        {/* Search */}
        {savedDecks.length > 0 && (
          <div className="sd-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search decks…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Empty state */}
        {savedDecks.length === 0 && (
          <div className="sd-empty">
            <span className="empty-icon">📭</span>
            <h2>No saved decks yet</h2>
            <p>Generate a flashcard deck and tap <strong>Save deck</strong> to keep it here.</p>
            <button className="btn-go-gen" onClick={() => navigate('/generate')}>
              Generate flashcards →
            </button>
          </div>
        )}

        {/* No search results */}
        {savedDecks.length > 0 && filtered.length === 0 && (
          <div className="sd-empty">
            <span className="empty-icon">🔎</span>
            <p>No decks match "<strong>{searchTerm}</strong>"</p>
          </div>
        )}

        {/* Deck grid */}
        <div className="sd-grid">
          {filtered.map(deck => (
            <div className="sd-card" key={deck._id}>

              {/* Difficulty strip */}
              <div className="sd-card-strip" style={{ background: diffColor(deck.difficulty) }} />

              <div className="sd-card-body">
                <div className="sd-card-top">
                  <span className="sd-diff-badge"
                    style={{ background: diffColor(deck.difficulty) + '22', color: diffColor(deck.difficulty) }}>
                    {deck.difficulty}
                  </span>
                  <span className="sd-time">{timeAgo(deck.createdAt)}</span>
                </div>

                <h3 className="sd-deck-title">{deck.title}</h3>
                <p className="sd-deck-count">{deck.cards.length} cards</p>

                <div className="sd-card-actions">
                  <button className="btn-browse" onClick={() => openBrowse(deck)}>
                    📖 Browse
                  </button>
                  <button className="btn-quiz-card" onClick={() => openQuiz(deck)}>
                    🧠 Quiz
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => setDeleteConfirm(deck._id)}
                    title="Delete deck"
                  >
                    🗑
                  </button>
                </div>
              </div>

              {/* Inline delete confirm */}
              {deleteConfirm === deck._id && (
                <div className="delete-confirm">
                  <p>Delete this deck?</p>
                  <div className="delete-confirm-btns">
                    <button className="btn-confirm-del" onClick={() => handleDelete(deck._id)}>
                      Yes, delete
                    </button>
                    <button className="btn-cancel-del" onClick={() => setDeleteConfirm(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}