import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PokemonCardWrapper.css';
import PokemonLocation from './PokemonLocation';
import PokemonMap from './PokemonMap';
import EvolvingPage from './EvolvingPage';
import PokemonMoves from './PokemonMoves';
 
import PokeballLoader from './PokeballLoader';


const PokemonCardWrapper = () => {
  const { id } = useParams();
  const [pokemonData, setPokemonData] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comments, setComments] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [soundUrl, setSoundUrl] = useState(null);
  const [hasCommented, setHasCommented] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isEvolving, setIsEvolving] = useState({ evolving: false, prevPokemon: '', newPokemon: '' });
  const [hasRating, setHasRating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);

  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(`${apiUrl}${id}`);
        const data = await response.json();
        setPokemonData(data);

        console.log(data);

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
        setIsFavorite(userActions.data.isFavorite || false);
        setHasRating(!!userActions.data.rating);
        setCommentList(userActions.data.comments || []);

        setSoundUrl(data.cries.latest);

        setIsLoading(false);

        await axios.post('http://localhost:3010/updateRecentPokemons', { pokemonId: id, pokemonData: data },
          {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json'
            }
          }
        );

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
        const statValue = pokemonData.stats[index].base_stat;
        const widthPercentage = (statValue / 180) * 100; // Calculate width based on max value of 200
        setTimeout(() => {
          stat.style.width = `${widthPercentage}%`;
        }, 100);
      });
      if (audioRef.current && soundUrl) {
        audioRef.current.play().catch(error => {
          console.error('Error playing sound:', error);
        });
      }
    }
  }, [pokemonData, soundUrl]);


  const handleCommentSubmit = async () => {
    if (!hasCommented && comments.trim()) {
      setCommentList([...commentList, comments]);
      setHasCommented(true);

      const token = JSON.parse(String(localStorage.getItem('token')));
      const pokemonId = Number(id);

      if (token) {
        const commentResponse = await axios.post('http://localhost:3010/commentPokemon', {
          pokemon_id: pokemonId,
          comment: comments
        }, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        });

        const prevPokemon = commentResponse.data.xpResponse.user.buddyPokemon;
        const newPokemon = commentResponse.data.xpResponse.updatedUser.buddyPokemon;

        if (prevPokemon !== newPokemon) {
          setIsEvolving({ evolving: true, prevPokemon: prevPokemon, newPokemon: newPokemon });
        }

        setHasCommented(true);
      }
    }
  };

  const handleDeleteComment = async (index) => {
    const updatedComments = commentList.filter((_, i) => i !== index);
    setCommentList(updatedComments);
    setHasCommented(false);
    setComments('');

    const token = JSON.parse(String(localStorage.getItem('token')));
    const pokemonId = Number(id);

    if (token) {
      await axios.delete('http://localhost:3010/deleteComment', {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        data: {
          pokemon_id: pokemonId
        }
      });
    }
  };

  const handleRateSubmit = async (star) => {

    setRating(star);

    const token = JSON.parse(String(localStorage.getItem('token')));
    const pokemonId = Number(id);

    if (token) {
      const rateResponse = await axios.post('http://localhost:3010/ratePokemon', {
        pokemon_id: pokemonId,
        rating: star
      }, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      });

      const prevPokemon = rateResponse.data.xpResponse.user.buddyPokemon;
      const newPokemon = rateResponse.data.xpResponse.updatedUser.buddyPokemon;

      if (prevPokemon !== newPokemon) {
        setIsEvolving({ evolving: true, prevPokemon: prevPokemon, newPokemon: newPokemon });
      }
      setHasRating(true);
    }
  };

  const handleDeleteRating = async () => {
    setRating(0);
    setHasRating(false);

    const token = JSON.parse(String(localStorage.getItem('token')));
    const pokemonId = Number(id);

    if (token) {
      await axios.delete('http://localhost:3010/deleteRating', {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        data: {
          pokemon_id: pokemonId
        }
      });
    }
  };

  const handlePlaySound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  };

  const handleToggleFavorite = async () => {
    const token = JSON.parse(String(localStorage.getItem('token')));
    const pokemonId = Number(id);
    const pokemonName = pokemonData.name;

    if (token) {
      if (isFavorite) {
        await axios.delete('http://localhost:3010/removeFavouritePokemon', {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          },
          data: {
            pokemon_id: pokemonId,
          },
        });

        setIsFavorite(false);
      } else {

        setIsFavorite(true);

        const favResponse = await axios.post('http://localhost:3010/addFavouritePokemon', {
          pokemon_id: pokemonId,
          pokemon_name: pokemonName,
        }, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        });

        const prevPokemon = favResponse.data.xpResponse.user.buddyPokemon;
        const newPokemon = favResponse.data.xpResponse.updatedUser.buddyPokemon;

        if (prevPokemon !== newPokemon) {
          setIsEvolving({ evolving: true, prevPokemon: prevPokemon, newPokemon: newPokemon });
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <PokeballLoader />
      </div>
    );
  }

  if (isEvolving.evolving) {
    return <EvolvingPage prevPokemon={isEvolving.prevPokemon} newPokemon={isEvolving.newPokemon} setIsEvolving={setIsEvolving} />;
  }
  const getTypeWeakness = (type) => {
    const typeWeaknesses = {
      normal: ["fighting"],
      fighting: ["flying", "psychic", "fairy"],
      flying: ["rock", "electric", "ice"],
      poison: ["ground", "psychic"],
      ground: ["water", "grass", "ice"],
      rock: ["fighting", "ground", "steel", "water", "grass"],
      bug: ["flying", "rock", "fire"],
      ghost: ["ghost", "dark"],
      steel: ["fighting", "ground", "fire"],
      fire: ["ground", "rock", "water"],
      water: ["grass", "electric"],
      grass: ["flying", "poison", "bug", "fire", "ice"],
      electric: ["ground"],
      psychic: ["bug", "ghost", "dark"],
      ice: ["fighting", "rock", "steel", "fire"],
      dragon: ["ice", "dragon", "fairy"],
      dark: ["fighting", "bug", "fairy"],
      fairy: ["poison", "steel"],
      unknown: [],
      shadow: [],
    };

    return typeWeaknesses[type] || [];
  };
  return (
    <div className=''>
      <div className="pokemon-container flex flex-col">
        <div className={`pokemon-card ${pokemonData.types[0].type.name}`}>
          <div className="top-section">
            <h2>{pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
            {/* <div className={`type ${pokemonData.types[0].type.name}`}>{pokemonData.types[0].type.name}</div> */}
          </div>

          {/* <PokemonMoves moves={pokemonData.moves}/> */}

          <div className="main-section">
            <div className="details">
              <p>ID: {pokemonData.id} </p>
              <p>Height: {pokemonData.height} {"dm"}</p>
              <p>Weight: {pokemonData.weight} {"hm"}</p>
              <p>Abilities: {pokemonData.abilities.map(ability => ability.ability.name).join(', ')}</p>
              <p>Forms: {pokemonData.forms.map(form => form.name).join(', ')}</p>
              <div className="type-box">
                <p>Type: {pokemonData.types.map(type => type.type.name).join(', ')}</p>
              </div>
              <div className="weakness-box">
                <p>Weakness: {pokemonData.types.flatMap(type => getTypeWeakness(type.type.name)).join(', ')}</p>
              </div>
            </div>

            <div className="image-container">
              <img src={pokemonData.sprites.other['official-artwork'].front_default} alt={pokemonData.name} />
            </div>

            <div className="stats">
              {pokemonData.stats.map((stat, index) => (
                <div key={stat.stat.name} className="stat">
                  <div className="stat-name text-[2.5rem]">{stat.stat.name === 'special-attack' ? 'Sp. Atk' : stat.stat.name === 'special-defense' ? 'Sp. Def' : stat.stat.name}</div>
                  <div className="stat-bar">
                    <div className="stat-bar-inner">{stat.base_stat}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='bottom-section grid grid-cols-12'>
            <div className='col-span-3 mt-[1rem]'>
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
            </div>
            <div className='col-span-6'>
              <div className="rating-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${hover >= star || rating >= star ? 'hover' : ''} ${hasRating && rating >= star ? 'selected' : ''}`}
                    onMouseEnter={() => !hasRating && setHover(star)}
                    onMouseLeave={() => !hasRating && setHover(null)}
                    onClick={() => !hasRating && handleRateSubmit(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <div className="favorite-container text-[1.5rem] flex flex-row justify-center mt-[1rem]">
                <button
                  onClick={handleToggleFavorite}
                  className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                >
                  {isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
                </button>
              </div>

              <div className="comment-section">
                {
                  !hasCommented ? (
                    <div className='w-full flex flex-col justify-center items-center'>
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Leave a comment..."
                        disabled={hasCommented}
                      />
                      <button className='yash my-[1rem]' onClick={handleCommentSubmit} disabled={hasCommented}>Submit</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <h1 className="text-2xl font-bold text-black">Existing Comment:</h1>
                      <div className="pokemon-theme">
                        {comments}
                      </div>
                    </div>
                  )}
                {/* <div className="comments-list">
              {
                commentList.length > 0 && commentList.map((comment, index) => (
                  <p key={index}>{comment}</p>
                ))}
            </div> */}
              </div>
            </div>
            <div className='col-span-3 w-full'>

              {
                hasRating &&
                <div className='w-full flex justify-center my-[1rem]'>
                  <button className="yash" onClick={handleDeleteRating}>Delete Rating!</button>
                </div>
              }
              {
                hasCommented &&
                <div className='w-full flex justify-center mb-[1rem]'>
                  <button className='yash mt-[1rem]' onClick={handleDeleteComment}>Delete Comment</button>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="h-[60px] w-full "></div>
        <div className="flex flex-row justify-around bg-blue-50 items-center w-screen h-full relative">
          <img src="../../public/nooo.jpg" alt="" className="absolute w-screen h-full" />
          <div className="absolute backdrop-brightness-50 backdrop-blur-xl w-screen h-full"></div>
          <div className="flex flex-col gap-4 items-center w-full h-full z-50">
            <div>
              <img src="../../public/mapp.png" alt="" height="400" width="400" />
            </div>
            <div className="flex flex-row justify-around items-center w-full">
              <PokemonMap pokemonId={Number(id)} />
              <PokemonLocation pokemonId={Number(id)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCardWrapper;
