// src/App.tsx
import React from 'react';
//import PokemonMap from './components/PokemonMap';
//import CapturePhoto from './components/CapturePhoto';
import Home from './components/Home';

const App: React.FC = () => {
  return (
    <div className="App">
      {/* <h1>Pokémon Map</h1>
      <PokemonMap pokemonId={1} /> */}
      {/* <CapturePhoto /> */}
      <Home />
    </div>
  );
};

export default App;
