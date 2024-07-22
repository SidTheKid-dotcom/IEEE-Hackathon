import React from 'react';

const ComponentBreakdown: React.FC = () => {
  return (
    <main>
      <h1>Component Breakdown</h1>
      <h2>Frontend Components</h2>
      <ul>
        <li>Header: Contains the navigation bar and logo.</li>
        <li>Footer: Includes links to community features and additional resources.</li>
        <li>PokemonCard: Displays a summary of a Pokemon.</li>
        <li>PokemonDetail: Shows detailed information about a specific Pokemon.</li>
        <li>SearchBar: Provides search functionality.</li>
        <li>FilterPanel: Allows users to filter Pokemon based on various criteria.</li>
        <li>Map: Interactive map showing Pokemon habitats.</li>
      </ul>
      <h2>Backend Components</h2>
      <ul>
        <li>User Authentication: Handles user registration, login, and authentication.</li>
        <li>Pokemon Data: Fetches and processes data from the PokeAPI.</li>
        <li>Image Recognition: Processes and identifies Pokemon from uploaded images.</li>
        <li>Community Features: Manages forums, chat rooms, and user interactions.</li>
      </ul>
    </main>
  );
};

export default ComponentBreakdown;
