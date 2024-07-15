// src/App.tsx
import React from 'react';
import PokemonMap from './components/PokemonMap';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Pokémon Map</h1>
      <PokemonMap pokemonId={1} />
    </div>
  );
};

export default App;
