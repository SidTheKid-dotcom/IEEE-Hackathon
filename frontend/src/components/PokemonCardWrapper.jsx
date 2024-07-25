import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PokemonCardWrapper.css';
import PokemonLocation from './PokemonLocation';
import PokemonMap from './PokemonMap';
const PokemonCardWrapper = () => {
  const { id } = useParams();
  const [pokemonData, setPokemonData] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comments, setComments] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [soundUrl, setSoundUrl] = useState(null);
  const [hasCommented, setHasCommented] = useState(false);
  const audioRef = useRef(null);

  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(`${apiUrl}${id}`);
        const data = await response.json();
        setPokemonData(data);

        const token = JSON.parse(String(localStorage.getItem('token')));

        const userActions = await axios.get(`http://localhost:3010/getInfo/${id}`, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        });

        setRating(userActions.data.rating || 0);
        setComments(userActions.data.comment || '');
        setHasCommented(!!userActions.data.comment);

        // Fetch the sound URL for the Pokémon
        setSoundUrl(data.cries.latest);

      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };

    fetchPokemonData();
  }, [id]);

  useEffect(() => {
    if (pokemonData) {
      const stats = document.querySelectorAll('.stat-bar-inner');
      stats.forEach((stat, index) => {
        setTimeout(() => {
          stat.style.width = `${pokemonData.stats[index].base_stat}%`;
        }, 200);
      });
      if (audioRef.current && soundUrl) {
        audioRef.current.play().catch(error => {
          console.error('Error playing sound:', error);
        });
      }
    }
  }, [pokemonData, soundUrl]);


  const handleRating = (newRating) => {
    setRating(newRating);
  };

  const handleCommentSubmit = async () => {
    if (!hasCommented && comments.trim()) {
      setCommentList([...commentList, comments]);
      setComments('');

      const token = JSON.parse(String(localStorage.getItem('token')));
      const pokemonId = Number(id);

      if (token) {
        await axios.post('http://localhost:3010/commentPokemon', {
          pokemon_id: pokemonId,
          comment: comments
        }, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        });

        await axios.post('http://localhost:3010/ratePokemon', {
          pokemon_id: pokemonId,
          rating: Number(rating)
        }, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        });

        setHasCommented(true);
      }
    }
  };

  const handlePlaySound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  };

  if (!pokemonData) {
    return <div>Loading...</div>;
  }

  return (
    <div className=''>
      <div className="pokemon-container flex flex-col"> 
        <div className={`pokemon-card ${pokemonData.types[0].type.name}`}>
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
              {pokemonData.stats.map((stat, index) => (
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
                className={`star ${hover >= star || rating >= star ? 'hover' : ''} ${rating >= star ? 'selected' : ''}`}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                onClick={() => handleRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <div className="sound-container w-full flex flex-row justify-center">
            <button
              onClick={handlePlaySound}
              className="yash"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19V6l10 7-10 7z"
                />
              </svg>
              <span>Play Sound</span>
            </button>
            <audio ref={audioRef} src={soundUrl || ''} preload="auto" />
          </div>

          <div className="comment-section">
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Leave a comment..."
              disabled={hasCommented}
            />
            <button className='yash' onClick={handleCommentSubmit} disabled={hasCommented}>Submit</button>
            <div className="comments-list">
              {commentList.map((comment, index) => (
                <p key={index}>{comment}</p>
              ))}
            </div>
          </div>
        </div>
        <div className='flex flex-row'>
          <PokemonMap pokemonId={Number(id)} />
          <PokemonLocation pokemonId={Number(id)} />
        </div>
      </div>
    </div>
  );
};

export default PokemonCardWrapper;
