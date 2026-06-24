import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateFlashcards } from '../utils/Api';
import './Generate.css';

const DIFFICULTIES = [
  { value: 'easy',   label: '😊 Easy',   desc: 'Simple recall' },
  { value: 'medium', label: '🎯 Medium', desc: 'Conceptual' },
  { value: 'hard',   label: '🔥 Hard',   desc: 'Deep analysis' },
];
const COUNTS = [5, 10, 15, 20];

export default function Generate() {
  const navigate   = useNavigate();
  const fileRef    = useRef();

  const [inputMode,   setInputMode]   = useState('text');
  const [text,        setText]        = useState('');
  const [file,        setFile]        = useState(null); 
  const [fileName,    setFileName]    = useState('');
  const [difficulty,  setDifficulty]  = useState('medium');
  const [count,       setCount]       = useState(10);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  // Robust Cache Key generator
  const getCacheKey = () => {
    const str = (text || fileName) + difficulty + count;
    try { return 'cache_' + btoa(unescape(encodeURIComponent(str))); }
    catch (e) { return 'cache_' + str.replace(/[^a-z0-9]/gi, '_'); }
  };

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError('');
    }
  };

  const handleGenerate = async () => {
    if (!text.trim() && !file) return setError('Please provide text or upload a file.');

    // 1. Check Cache
    const cacheKey = getCacheKey();
    const cachedDeck = sessionStorage.getItem(cacheKey);
    if (cachedDeck) {
      return navigate('/flashcards', { state: { deck: JSON.parse(cachedDeck) } });
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    if (file) formData.append('file', file);
    else formData.append('text', text);
    
    formData.append('difficulty', difficulty);
    formData.append('count', count);

    try {
      const cards = await generateFlashcards(formData);
      
      const deck = {
        id: `deck-${Date.now()}`,
        title: fileName || text.slice(0, 30) + '...',
        difficulty,
        cards,
        createdAt: new Date().toISOString(),
      };

      // 3. Cache and Navigate
      sessionStorage.setItem(cacheKey, JSON.stringify(deck));
      navigate('/flashcards', { state: { deck } });
    } catch (err) {
      setError(err.message || 'Generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-page">
      <div className="generate-container">
        <h1>Generate Flashcards</h1>
        
        {/* Input Mode */}
        <div className="section-card">
          <div className="mode-tabs">
            <button className={`mode-tab ${inputMode === 'text' ? 'active' : ''}`} onClick={() => { setInputMode('text'); setFile(null); }}>✏️ Text</button>
            <button className={`mode-tab ${inputMode === 'file' ? 'active' : ''}`} onClick={() => { setInputMode('file'); setText(''); }}>📁 File (PDF/TXT)</button>
          </div>

          {inputMode === 'text' ? (
            <textarea className="text-input" rows={8} placeholder="Paste notes here..." value={text} onChange={e => setText(e.target.value)} />
          ) : (
            <div className="drop-zone" onClick={() => fileRef.current.click()}>
              <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleFile} accept=".txt,.pdf" />
              {fileName || "Click to upload file"}
            </div>
          )}
        </div>

        {/* Difficulty & Count */}
        <div className="section-card">
          <div className="difficulty-grid">
            {DIFFICULTIES.map(d => (
              <button key={d.value} className={`diff-btn ${difficulty === d.value ? 'active' : ''}`} onClick={() => setDifficulty(d.value)}>{d.label}</button>
            ))}
          </div>
          <div className="count-pills">
            {COUNTS.map(c => (
              <button key={c} className={`count-pill ${count === c ? 'active' : ''}`} onClick={() => setCount(c)}>{c} cards</button>
            ))}
          </div>
        </div>

        {error && <p className="gen-error">⚠️ {error}</p>}
        
        <button className="btn-generate" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : `✦ Generate ${count} cards`}
        </button>
      </div>
    </div>
  );
}