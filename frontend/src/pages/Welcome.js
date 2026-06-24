import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const FEATURES = [
  { icon: '🤖', title: 'AI-Powered',   desc: 'Gemini reads your text and generates smart Q&A pairs automatically.' },
  { icon: '🃏', title: '3D Flip Cards', desc: 'Beautiful card flip — question on front, full answer revealed on back.' },
  { icon: '🧠', title: 'Quiz Mode',     desc: 'Test yourself, track your score, and review every card you missed.' },
  { icon: '💾', title: 'Save Decks',   desc: 'Save any generated deck and revisit your flashcards anytime.' },
];

const STEPS = [
  { n: '01', title: 'Paste or upload',  desc: 'Drop in any text — notes, articles, textbook chapters.' },
  { n: '02', title: 'Pick difficulty',  desc: 'Choose Easy, Medium, or Hard to match your study goal.' },
  { n: '03', title: 'Study your cards', desc: 'Flip cards, run a quiz, and save decks you want to revisit.' },
];

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-badge">✦ AI-Powered Study Tool</div>
        <h1 className="hero-title">
          Turn any text into<br />
          <span className="grad-text">smart flashcards</span>
        </h1>
        <p className="hero-sub">
          Paste a paragraph, upload a file, or drop in your notes — FlashAI
          uses GPT to generate question & answer cards in seconds.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate('/signup')}>
            Get started free →
          </button>
          <button className="btn-outline" onClick={() => navigate('/login')}>
            Sign in
          </button>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section">
        <h2 className="section-title">How it works</h2>
        <div className="steps-row">
          {STEPS.map(s => (
            <div className="step-card" key={s.n}>
              <div className="step-number">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <h2 className="section-title">Everything you need</h2>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="cta-strip">
        <h2>Ready to study smarter?</h2>
        <p>Join thousands of learners using AI to master any subject faster.</p>
        <button className="btn-primary large" onClick={() => navigate('/signup')}>
          Create your free account →
        </button>
      </section>
    </div>
  );
}