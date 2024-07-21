import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  forms: { name: string }[];
  sprites: { other: { 'official-artwork': { front_default: string } } };
  stats: { base_stat: number; stat: { name: string } }[];
  types: { type: { name: string } }[];
}

const PokemonCardWrapper: React.FC = () => {

  const params = useParams();

  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [comments, setComments] = useState<string>('');
  const [commentList, setCommentList] = useState<string[]>([]);
  const [pokemonId] = useState<number>(Number(params.id));

  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(`${apiUrl}${pokemonId}`);
        const data: PokemonData = await response.json();
        setPokemonData(data);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };

    fetchPokemonData();
  }, [pokemonId]);

  useEffect(() => {
    const stats = document.querySelectorAll('.stat-bar-inner');
    stats.forEach((stat, index) => {
      setTimeout(() => {
        if (pokemonData) {
          stat.setAttribute('style', `width: ${pokemonData.stats[index].base_stat}%`);
        }
      }, 100);
    });
  }, [pokemonData]);

  const handleRating = (newRating: number) => {
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

  return (
    <div className="pokemon-container">
      <div className="pokemon-card">
        <div className="top-section">
          <h2>{pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
          <div className={`type ${pokemonData.types[0].type.name}`}>{pokemonData.types[0].type.name}</div>
        </div>

        <div className="main-section">
          <div className="details">
            <p>ID: {pokemonData.id}</p>
            <p>Height: {pokemonData.height}</p>
            <p>Weight: {pokemonData.weight}</p>
            <p>Abilities: {pokemonData.abilities.map(ability => ability.ability.name).join(', ')}</p>
            <p>Forms: {pokemonData.forms.map(form => form.name).join(', ')}</p>
          </div>

          <div className="image-container">
            <img src={pokemonData.sprites.other['official-artwork'].front_default} alt={pokemonData.name} />
          </div>

          <div className="stats">
            {pokemonData.stats.map((stat) => (
              <div key={stat.stat.name} className="stat">
                <div className="stat-name">{stat.stat.name}</div>
                <div className="stat-bar">
                  <div className="stat-bar-inner">{stat.base_stat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rating-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${hover !== null && hover >= star || rating >= star ? 'hover' : ''} ${rating >= star ? 'selected' : ''}`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <div className="comment-section">
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Leave a comment..."
          />
          <button onClick={handleCommentSubmit}>Submit</button>
          <div className="comments-list">
            {commentList.map((comment, index) => (
              <p key={index}>{comment}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCardWrapper;


