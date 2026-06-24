import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Generate from './pages/Generate';
import Flashcards from './pages/Flashcards';
import SavedDecks  from './pages/SavedDecks';

const PrivateRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/generate" element={<PrivateRoute><Generate /></PrivateRoute>} />
          <Route path="/flashcards" element={<PrivateRoute><Flashcards /></PrivateRoute>} />
          <Route path="/saved"      element={<PrivateRoute><SavedDecks /></PrivateRoute>} />
          {/* Default catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}