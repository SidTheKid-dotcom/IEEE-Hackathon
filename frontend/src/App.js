import React, { useState, useEffect } from 'react';
import './styles.css';

const App = () => {
  const [pokemonData, setPokemonData] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comments, setComments] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [pokemonId] = useState(4); // Default Pokémon ID

  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(`${apiUrl}${pokemonId}`);
        const data = await response.json();
        setPokemonData(data);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };

    fetchPokemonData();
  }, [pokemonId]);

  useEffect(() => {
    if (pokemonData) {
      const stats = document.querySelectorAll('.stat-bar-inner');
      stats.forEach((stat, index) => {
        setTimeout(() => {
          stat.style.width = `${pokemonData.stats[index].base_stat}%`;
        }, 100);
      });
    }
  }, [pokemonData]);

  const handleRating = (newRating) => {
    setRating(newRating);
  };

  const handleCommentSubmit = () => {
    if (comments.trim()) {
      setCommentList([...commentList, comments]);
      setComments('');
    }
  };

  if (!pokemonData) {
    return <div>Loading...</div>; // Display loading state while data is being fetched
  }

  const typeColor = pokemonData.types[0].type.name;

  return (
    <div className="pokemon-container flex justify-center items-center h-screen w-screen">
      <div className={`pokemon-card flex flex-col items-center shadow-lg rounded-lg overflow-hidden w-full max-w-5xl p-4 relative bg-gradient-to-b from-${typeColor}-500 to-${typeColor}-300`}>
        <div className="top-section text-center mb-4">
          <h2 className="text-3xl font-bold capitalize typing">{pokemonData.name}</h2>
          <div className={`type bg-${typeColor}-700 text-white py-1 px-2 rounded capitalize`}>
            {pokemonData.types[0].type.name}
          </div>
        </div>

        <div className="main-section flex flex-wrap justify-between items-center">
          <div className="details flex flex-col flex-1 text-lg slide-in-3d">
            <p>ID: {pokemonData.id}</p>
            <p>Height: {pokemonData.height}</p>
            <p>Weight: {pokemonData.weight}</p>
            <p>Abilities: {pokemonData.abilities.map(ability => ability.ability.name).join(', ')}</p>
            <p>Forms: {pokemonData.forms.map(form => form.name).join(', ')}</p>
          </div>

          <div className="image-container flex justify-center items-center flex-1">
            <img src={pokemonData.sprites.other['official-artwork'].front_default} alt={pokemonData.name} className="w-64 h-64 object-contain slide-in" />
          </div>

          <div className="stats flex flex-col flex-1 slide-in-3d">
            {pokemonData.stats.map((stat) => (
              <div key={stat.stat.name} className="stat flex items-center mb-2 w-full">
                <div className="stat-name w-24 capitalize text-lg">{stat.stat.name}</div>
                <div className="stat-bar flex-1 bg-gray-300 h-4 rounded overflow-hidden ml-2">
                  <div className="stat-bar-inner bg-green-500 h-full text-center text-white font-bold text-xs" style={{ width: 0 }}>{stat.base_stat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rating-container flex justify-center items-center mt-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star text-3xl cursor-pointer mx-1 ${hover >= star || rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <div className="comment-section flex flex-col items-center mt-4">
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Leave a comment..."
            className="w-4/5 max-w-lg h-20 p-2 border rounded"
          />
          <button onClick={handleCommentSubmit} className="mt-2 py-2 px-4 bg-green-500 text-white rounded">Submit</button>
          <div className="comments-list w-4/5 max-w-lg mt-4">
            {commentList.map((comment, index) => (
              <p key={index} className="bg-gray-100 p-2 rounded mb-2">{comment}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;