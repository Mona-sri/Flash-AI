import React, { useState } from 'react';
import './Flashcard.css';

export default function Flashcard({ flashcard, index, listView = false }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`fc-scene ${listView ? 'list-view' : ''}`}
      onClick={() => setFlipped(f => !f)}
      role="button"
      tabIndex={0}
      aria-label={flipped ? 'Show question' : 'Show answer'}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setFlipped(f => !f)}
    >
      <div className={`fc-card ${flipped ? 'flipped' : ''}`}>
        {/* Front – Question */}
        <div className="fc-face fc-front">
          <span className="fc-badge">Q{index + 1}</span>
          <p className="fc-text">{flashcard.question}</p>
          <span className="fc-hint">tap to reveal answer</span>
        </div>

        {/* Back – Answer */}
        <div className="fc-face fc-back">
          <span className="fc-badge answer-badge">Answer</span>
          <p className="fc-text">{flashcard.answer}</p>
          <span className="fc-hint">tap to flip back</span>
        </div>
      </div>
    </div>
  );
}