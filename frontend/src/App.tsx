// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import CameraPage from './components/CameraPage';
import PokemonCardWrapper from './components/PokemonCardWrapper';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/pokemon/:id" element={<PokemonCardWrapper />} />
      </Routes>
    </Router>
  );
};

export default App;
