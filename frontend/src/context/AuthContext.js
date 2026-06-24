import React, { createContext, useState } from 'react';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [savedDecks, setSavedDecks] = useState([]); 
  const signup = async (name, email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Signup failed');
    }
    return await res.json();
  };

  const login = async (email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
    }
    const data = await res.json();
    setUser(data.user); 
    return data.user;
  };

  React.useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:5000/api/decks/${user.id}`)
        .then(res => res.json())
        .then(data => setSavedDecks(data))
        .catch(err => console.error("Failed to fetch decks", err));
    }
  }, [user]);

  const saveDeck = async (deck) => {
    try {
      const res = await fetch('http://localhost:5000/api/decks/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...deck, userId: user.id }) 
      });
      const newDeck = await res.json();
      setSavedDecks(prev => [newDeck, ...prev]);
    } catch (err) {
      console.error("Failed to save deck to DB", err);
    }
  };
  const isDeckSaved = (id) => savedDecks.some(d => d.id === id);
  const logout = () => {
    setUser(null);
  };
  const deleteDeck = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/decks/${id}`, { 
      method: 'DELETE' 
    });
    if (res.ok) {
      setSavedDecks(prev => prev.filter(d => d._id !== id)); 
    } else {
      console.error("Server refused to delete deck");
    }
  } catch (err) {
    console.error("Delete request failed:", err);
  }
  };
  return (
    <AuthContext.Provider value={{ user, login, signup, logout, savedDecks, saveDeck,isDeckSaved,deleteDeck }}>
      {children}
    </AuthContext.Provider>
  );
};