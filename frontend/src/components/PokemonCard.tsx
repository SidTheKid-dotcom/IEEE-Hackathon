import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import './styles.css';

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  forms: { name: string }[];
  sprites: { other: { 'official-artwork': { front_default: string } } };
  stats: { stat: { name: string }, base_stat: number }[];
  types: { type: { name: string } }[];
}

const getTypeColor = (type: string): string => {
  const typeColors: { [key: string]: string } = {
    grass: '#000000',
    fire: '#f08030',
    water: '#6890f0',
    // Add more type colors as needed
  };
  return typeColors[type] || '#ccc'; // Default to light grey if type not found
};

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [statsStyle, setStatsStyle] = useState<{ [key: string]: string }>({});
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<string[]>([]);

  useEffect(() => {
    // Trigger the slide-in animation for details
    const detailElements = document.querySelectorAll('.details p');
    detailElements.forEach((element, index) => {
      (element as HTMLElement).style.animationDelay = `${index * 0.1}s`;
    });

    // Set width for stat bars
    const newStatsStyle: { [key: string]: string } = {};
    pokemon.stats.forEach(stat => {
      newStatsStyle[stat.stat.name] = `${stat.base_stat}%`;
    });
    setStatsStyle(newStatsStyle);
  }, [pokemon]);

  const playPokemonSound = (pokemonName: string) => {
    const soundUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemonName.toLowerCase()}.mp3`;
    const audio = new Audio(soundUrl);
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  };

  const handleCommentSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (comment.trim() === '') return;
    setComments([...comments, comment]);
    setComment('');
  };

  return (
    <div className="pokemon-card" style={{ background: `linear-gradient(to bottom, ${getTypeColor(pokemon.types[0].type.name)} 0%, #fff 100%)` }}>
      <button className="sound-button" onClick={() => playPokemonSound(pokemon.name)}>
        <img src="sound-icon.png" alt="Sound" />
      </button>
      <div className="top-section">
        <h2>{pokemon.name}</h2>
        <div className={`type ${pokemon.types[0].type.name}`}>
          {pokemon.types[0].type.name}
        </div>
      </div>
      <div className="main-section">
        <div className="details">
          <p className="slide-in">ID: {pokemon.id}</p>
          <p className="slide-in">Height: {pokemon.height}</p>
          <p className="slide-in">Weight: {pokemon.weight}</p>
          <p className="slide-in">Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
          <p className="slide-in">Form: {pokemon.forms.map(form => form.name).join(', ')}</p>
        </div>
        <div className="image-container">
          <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />
        </div>
        <div className="stats">
          {pokemon.stats.map(stat => (
            <div className="stat" key={stat.stat.name}>
              <div className="stat-name">{stat.stat.name}</div>
              <div className="stat-bar">
                <div className="stat-bar-inner" style={{ width: statsStyle[stat.stat.name] }}>
                  {stat.base_stat}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rating">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;

          return (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => setRating(ratingValue)}
              />
              <svg
                className="star"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </label>
          );
        })}
      </div>
      <div className="comment-section">
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={comment}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
            placeholder="Add your comment here..."
            rows={4}
          />
          <button type="submit">Submit</button>
        </form>
        <div className="comments-list">
          {comments.length > 0 ? (
            <ul>
              {comments.map((com, index) => (
                <li key={index}>{com}</li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
