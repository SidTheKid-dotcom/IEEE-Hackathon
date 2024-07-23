import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PokemonMap from './PokemonMap';
import PokemonLocation from './PokemonLocation';

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
  cries: { latest: string };
}

interface SoundData {
  url: string;
}

const PokemonCardWrapper: React.FC = () => {
  const params = useParams();
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [comments, setComments] = useState<string>('');
  const [commentList, setCommentList] = useState<string[]>([]);
  const [pokemonId] = useState<number>(Number(params.id));
  const [soundUrl, setSoundUrl] = useState<string | null>(null);
  const [hasCommented, setHasCommented] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(`${apiUrl}${pokemonId}`);
        const data: PokemonData = await response.json();
        setPokemonData(data);

        const token = JSON.parse(String(localStorage.getItem('token')));

        const userActions = await axios.get(`http://localhost:3010/getInfo/${pokemonId}`, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        });

        setRating(userActions.data.rating);
        setComments(userActions.data.comment || '');
        setHasCommented(!!userActions.data.comment);

        // Fetch the sound URL for the Pokémon
        setSoundUrl(data.cries.latest);

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

    if (audioRef.current && soundUrl) {
      audioRef.current.play();
    }
  }, [pokemonData, soundUrl]);

  const handleRating = (newRating: number) => {
    setRating(newRating);
  };

  const handleCommentSubmit = async () => {
    if (!hasCommented && comments.trim()) {
      setCommentList([comments]);
      setComments('');

      const token = JSON.parse(String(localStorage.getItem('token')));
      const pokemonId = Number(params.id);

      if (token) {
        await axios.post('http://localhost:3010/commentPokemon',
          {
            pokemon_id: pokemonId,
            comment: comments
          },
          {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json'
            }
          }
        );

        await axios.post('http://localhost:3010/ratePokemon',
          {
            pokemon_id: pokemonId,
            rating: Number(rating)
          },
          {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json'
            }
          }
        );

        setHasCommented(true);
      }
    }
  };

  const handlePlaySound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  if (!pokemonData) {
    return <div className="flex justify-center items-center h-screen w-screen text-lg font-bold">Loading...</div>;
  }

  const typeColor = {
    normal: 'bg-[#F0F0F0]',
    fighting: 'bg-[#D56A6A]',
    flying: 'bg-[#9AB8F3]',
    poison: 'bg-[#B89AC9]',
    ground: 'bg-[#D6B44C]',
    rock: 'bg-[#D6C2A0]',
    bug: 'bg-[#B4D200]',
    ghost: 'bg-[#A6A2C4]',
    steel: 'bg-[#C0C0C0]',
    fire: 'bg-[#F8A07B]',
    water: 'bg-[#8CC7F6]',
    grass: 'bg-[#9BC86E]',
    electric: 'bg-[#F4E8A1]',
    psychic: 'bg-[#F5A7B8]',
    ice: 'bg-[#A4D8E2]',
    dragon: 'bg-[#9A8DD3]',
    dark: 'bg-[#6D6D6D]',
    fairy: 'bg-[#F7B9B6]',
    unknown: 'bg-gray-500',
    shadow: 'bg-[#8C8C8C]'
  }[pokemonData.types[0].type.name] || 'bg-gray-500';

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
        <div className={`border-2 border-gray-300 rounded-lg shadow-lg w-full max-w-4xl h-auto flex flex-col p-5 bg-gradient-to-b ${typeColor} to-white overflow-hidden`}>
          <div className="text-center mb-5">
            <h2 className={`text-4xl font-bold capitalize mb-2 animate-typing font-[Decotura]`}>{pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
            <div className={`inline-block py-1 px-3 rounded text-black text-lg font-bold capitalize ${typeColor}`}>
              {pokemonData.types[0].type.name}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex-1 flex flex-col text-lg relative">
              <p className="mb-1">ID: {pokemonData.id}</p>
              <p className="mb-1">Height: {pokemonData.height}</p>
              <p className="mb-1">Weight: {pokemonData.weight}</p>
              <p className="mb-1">Abilities: {pokemonData.abilities.map(ability => ability.ability.name).join(', ')}</p>
              <p>Forms: {pokemonData.forms.map(form => form.name).join(', ')}</p>
            </div>

            <div className="flex-1 flex justify-center items-center my-5 md:my-0">
              <img src={pokemonData.sprites.other['official-artwork'].front_default} alt={pokemonData.name} className="w-64 object-contain" />
            </div>

            <div className="flex-1 flex flex-col items-start pl-5 relative">
              {pokemonData.stats.map((stat) => (
                <div key={stat.stat.name} className="flex items-center mb-2 w-full">
                  <div className="w-1/4 text-lg capitalize">{stat.stat.name}</div>
                  <div className="flex-1 h-4 bg-gray-300 rounded overflow-hidden ml-2">
                    <div className="stat-bar-inner h-full bg-green-500 text-center text-white font-bold text-xs transition-all"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center mt-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-3xl cursor-pointer mx-1 ${hover !== null && hover >= star || rating >= star ? 'text-yellow-500' : 'text-gray-300'} ${rating >= star ? 'text-yellow-500' : ''}`}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                onClick={() => handleRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center mt-5">
            <button onClick={handlePlaySound} className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">Play Sound</button>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Leave a comment..."
              className="w-4/5 max-w-lg h-20 p-2 border border-gray-300 rounded resize-none mt-4"
              disabled={hasCommented}
            />
            <button onClick={handleCommentSubmit} className="mt-2 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600" disabled={hasCommented}>Submit</button>
            <div className="w-4/5 max-w-lg mt-4">
              {commentList.map((comment, index) => (
                <p key={index} className="bg-gray-100 p-2 rounded mb-2">{comment}</p>
              ))}
            </div>
          </div>
          <audio ref={audioRef} src={soundUrl || ''} preload="auto" />
        </div>
      </div>
      <div className='flex flex-row'>
        <PokemonMap pokemonId={Number(params.id)} />
        <PokemonLocation pokemonId={Number(params.id)} />
      </div>
    </div>
  );
};

export default PokemonCardWrapper;
