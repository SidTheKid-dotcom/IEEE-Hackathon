import React from 'react';
import Card from '../components/Card';

const Features: React.FC = () => {
  return (
    <div className="features-page">
      <h1>Features</h1>
      <div className="card-container">
        <Card
          title="Real Pokedex Simulator"
          content="A fully interactive Pokedex simulation."
          imageUrl="https://img.pokemondb.net/artwork/large/pikachu.jpg"
        />
        <Card
          title="Real-Life Image Recognition"
          content="Recognize Pokemon from real-life images."
          imageUrl="https://img.pokemondb.net/artwork/large/bulbasaur.jpg"
        />
        <Card
          title="PokeAPI Integration"
          content="Retrieve detailed information from PokeAPI."
          imageUrl="https://img.pokemondb.net/artwork/large/charizard.jpg"
        />
        {/* Add more cards as needed */}
      </div>
    </div>
  );
};

export default Features;
