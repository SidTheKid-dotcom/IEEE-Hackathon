// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import CameraPage from './components/CameraPage';
import PokemonCardWrapper from './components/PokemonCardWrapper';

// @ts-ignore
import BuddyPokemon from './components/BuddyPokemon.jsx'

// @ts-ignore
import LoginWrapper from './components/LoginWrapper.jsx';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/buddyPokemon" element={<BuddyPokemon />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/pokemon/:id" element={<PokemonCardWrapper />} />
      </Routes>
    </Router>
  );
};

export default App;
