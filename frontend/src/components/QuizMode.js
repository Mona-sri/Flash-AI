import React, { useState, useEffect, useCallback } from 'react';
import './QuizMode.css';

export default function QuizMode({ cards, onExit }) {
  const [mode, setMode] = useState('study'); // 'study' | 'quiz' | 'results'
  const [index, setIndex] = useState(0);
  const [quizState, setQuizState] = useState({
    options: [],
    selected: null,
    isRevealed: false,
    score: 0
  });

  // Helper to generate multiple choice options
  const generateOptions = useCallback((currentCard) => {
    const wrong = cards.filter(c => c.answer !== currentCard.answer)
                       .sort(() => 0.5 - Math.random())
                       .slice(0, 3)
                       .map(c => c.answer);
    return [currentCard.answer, ...wrong].sort(() => 0.5 - Math.random());
  }, [cards]);

  // Start the quiz
  const startQuiz = () => {
    setMode('quiz');
    setIndex(0);
    setQuizState({ options: generateOptions(cards[0]), selected: null, isRevealed: false, score: 0 });
  };

  const handleSelect = (option) => {
    if (quizState.isRevealed) return;
    const isCorrect = option === cards[index].answer;
    setQuizState(prev => ({
      ...prev,
      selected: option,
      isRevealed: true,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  };

  const nextQuestion = () => {
    if (index + 1 < cards.length) {
      setIndex(i => i + 1);
      setQuizState({ options: generateOptions(cards[index + 1]), selected: null, isRevealed: false, score: quizState.score });
    } else {
      setMode('results');
    }
  };

  /* ── Mode 1: Study (Flip Cards) ── */
  if (mode === 'study') {
    return (
      <div className="quiz-mode">
        <div className="quiz-header">
          <button className="quiz-exit" onClick={onExit}>← Exit</button>
          <h2>Study Mode</h2>
        </div>
        <div className="quiz-card">
           <p>Review your cards. When ready, click "Start Quiz" to test your knowledge.</p>
           <button className="btn-reveal" onClick={startQuiz}>Start Quiz Mode →</button>
        </div>
      </div>
    );
  }

  /* ── Mode 2: Quiz (Multiple Choice) ── */
  if (mode === 'quiz') {
    const current = cards[index];
    return (
      <div className="quiz-mode">
        <div className="quiz-header"><span>Question {index + 1} / {cards.length}</span></div>
        <div className="quiz-card">
          <p className="quiz-question">{current.question}</p>
          <div className="options-grid">
            {quizState.options.map((opt, i) => (
              <button 
                key={i} 
                className={`opt-btn ${quizState.isRevealed ? (opt === current.answer ? 'correct' : (opt === quizState.selected ? 'wrong' : 'dim')) : ''}`}
                onClick={() => handleSelect(opt)}
                disabled={quizState.isRevealed}
              >
                {opt}
              </button>
            ))}
          </div>
          {quizState.isRevealed && (
            <button className="btn-reveal" onClick={nextQuestion}>
              {index + 1 === cards.length ? 'See Results' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── Mode 3: Results ── */
  return (
    <div className="quiz-done">
      <h2>Quiz Complete!</h2>
      <p>Your Score: {Math.round((quizState.score / cards.length) * 100)}%</p>
      <button className="btn-exit-done" onClick={onExit}>Finish</button>
    </div>
  );
}