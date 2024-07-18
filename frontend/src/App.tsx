// src/App.tsx
import React from 'react';
//import PokemonMap from './components/PokemonMap';
import CapturePhoto from './components/CapturePhoto';

const App: React.FC = () => {
  return (
    <div className="App">
      {/* <h1>Pokémon Map</h1>
      <PokemonMap pokemonId={1} /> */}
      <CapturePhoto />
    </div>
  );
};

export default App;
