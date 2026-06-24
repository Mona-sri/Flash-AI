import React, { useState } from 'react';
import Flashcard from './Flashcard';
import './FlashcardList.css';

export default function FlashcardList({ cards }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  if (!cards || !cards.length) return <p className="no-cards">No flashcards to display.</p>;

  return (
    <div className="fcl-wrapper">
      {/* View toggle */}
      <div className="view-toggle">
        <span className="toggle-label">{cards.length} cards</span>
        <div className="toggle-btns">
          <button
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <GridIcon /> Grid
          </button>
          <button
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <ListIcon /> List
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className={viewMode === 'grid' ? 'fcl-grid' : 'fcl-list'}>
        {cards.map((card, i) => (
          <Flashcard
            key={card.id || i}
            flashcard={card}
            index={i}
            listView={viewMode === 'list'}
          />
        ))}
      </div>
    </div>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="0" y="0" width="6" height="6" rx="1"/>
      <rect x="8" y="0" width="6" height="6" rx="1"/>
      <rect x="0" y="8" width="6" height="6" rx="1"/>
      <rect x="8" y="8" width="6" height="6" rx="1"/>
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="0" y="1" width="14" height="2.5" rx="1"/>
      <rect x="0" y="5.75" width="14" height="2.5" rx="1"/>
      <rect x="0" y="10.5" width="14" height="2.5" rx="1"/>
    </svg>
  );
}