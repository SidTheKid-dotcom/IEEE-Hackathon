// src/components/Home.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Select from 'react-select';
import { getPokemons } from '../services/pokemonService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [allPokemons, setAllPokemons] = useState<any[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>('https://pokeapi.co/api/v2/pokemon?limit=100');
  const [sortOption, setSortOption] = useState<string>('number');
  const [filterType, setFilterType] = useState<string>('');
  const [filterAbility, setFilterAbility] = useState<string>('');
  const [filterStats, setFilterStats] = useState<{ stat: string, value: number }>({ stat: '', value: 0 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [types, setTypes] = useState<any[]>([]);
  const [abilities, setAbilities] = useState<any[]>([]);
  const [stats] = useState<any[]>([
    { value: 'hp', label: 'HP' },
    { value: 'attack', label: 'Attack' },
    { value: 'defense', label: 'Defense' },
    { value: 'special-attack', label: 'Special Attack' },
    { value: 'special-defense', label: 'Special Defense' },
    { value: 'speed', label: 'Speed' }
  ]);
  const observer = useRef<IntersectionObserver>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate(); // Add this line to use navigation

  const lastPokemonElementRef = useCallback(
    (node: any) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextUrl) {
          loadMorePokemons();
        }
      });
      if (node) observer.current.observe(node);
    },
    [nextUrl]
  );

  const loadMorePokemons = async () => {
    if (nextUrl) {
      const { pokemonDetails, nextUrl: newNextUrl } = await getPokemons(nextUrl);
      setAllPokemons((prevPokemons) => [...prevPokemons, ...pokemonDetails]);
      setNextUrl(newNextUrl);
    }
  };

  const fetchTypes = async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/type');
    setTypes(response.data.results.map((type: any) => ({ value: type.name, label: type.name })));
  };

  const fetchAbilities = async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/ability?limit=1000');
    setAbilities(response.data.results.map((ability: any) => ({ value: ability.name, label: ability.name })));
  };

  useEffect(() => {
    fetchTypes();
    fetchAbilities();
  }, []);

  const sortPokemons = (pokemons: any[]) => {
    if (sortOption === 'number') {
      return pokemons.sort((a, b) => a.id - b.id);
    } else if (sortOption === 'type') {
      return pokemons.sort((a, b) => a.types[0].type.name.localeCompare(b.types[0].type.name));
    }
    return pokemons;
  };

  const filterPokemons = (pokemons: any[]) => {
    let filteredPokemons = pokemons;

    if (filterType) {
      filteredPokemons = filteredPokemons.filter((pokemon) =>
        pokemon.types?.some((type: any) => type.type.name === filterType)
      );
    }

    if (filterAbility) {
      filteredPokemons = filteredPokemons.filter((pokemon) =>
        pokemon.abilities?.some((ability: any) => ability.ability.name === filterAbility)
      );
    }

    if (filterStats.stat && filterStats.value > 0) {
      filteredPokemons = filteredPokemons.filter((pokemon) =>
        pokemon.stats?.some((stat: any) =>
          stat.stat.name === filterStats.stat && stat.base_stat >= filterStats.value
        )
      );
    }

    return filteredPokemons;
  };

  const getVisiblePokemons = () => {
    let visiblePokemons = allPokemons;
    visiblePokemons = filterPokemons(visiblePokemons);
    visiblePokemons = sortPokemons(visiblePokemons);
    return visiblePokemons;
  };

  useEffect(() => {
    loadMorePokemons();
  }, []);

  useEffect(() => {
    setPokemons(getVisiblePokemons());
  }, [allPokemons, sortOption, filterType, filterAbility, filterStats]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause(); // Start with audio paused
    }
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setSearchResult(null);
      return;
    }

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`);
      setSearchResult(response.data);
    } catch (error) {
      setSearchResult(null);
      console.error('Pokemon not found', error);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const navigateToCamera = () => {
    navigate('/camera');
  };

  const navigateToPokemon = (id: number) => {
    navigate(`/pokemon/${id}`);
  }

  return (
    <div className="bg-white text-black font-sans">
      <div className="container mx-auto text-center py-8">
        <h1 className="text-4xl font-bold text-red-500 mb-8">Pokédex</h1>
        <div className="flex justify-center mb-8 space-x-10">
          <div className="mr-4">
            <label className="block text-sm font-medium text-gray-700">Sort by</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            >
              <option value="number">Number</option>
              <option value="type">Type</option>
            </select>
          </div>
          <div className="mr-4">
            <label className="block text-sm font-medium text-gray-700">Filter by Type</label>
            <Select
              value={types.find((type) => type.value === filterType)}
              onChange={(selectedOption) => setFilterType(selectedOption?.value || '')}
              options={types}
              placeholder="Select Type"
              className="w-full"
            />
          </div>
          <div className="mr-4">
            <label className="block text-sm font-medium text-gray-700">Filter by Ability</label>
            <Select
              value={abilities.find((ability) => ability.value === filterAbility)}
              onChange={(selectedOption) => setFilterAbility(selectedOption?.value || '')}
              options={abilities}
              placeholder="Select Ability"
              className="w-full"
            />
          </div>
          <div className="mr-4">
            <label className="block text-sm font-medium text-gray-700">Filter by Base Stat</label>
            <div className="flex">
              <Select
                value={stats.find((stat) => stat.value === filterStats.stat)}
                onChange={(selectedOption) => setFilterStats({ ...filterStats, stat: selectedOption?.value || '' })}
                options={stats}
                placeholder="Select Stat"
                className="w-1/2 mr-2"
              />
              <input
                type="number"
                value={filterStats.value}
                onChange={(e) => setFilterStats({ ...filterStats, value: parseInt(e.target.value) || 0 })}
                placeholder="Value"
                className="block w-1/2 pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
          <div className="mr-4">
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              placeholder="Name or Number"
              className="mt-1 block w-full pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            />
            <button
              onClick={handleSearch}
              className="mt-2 bg-red-500 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-red-600"
            >
              Search
            </button>
          </div>
        </div>
        {searchResult ? (
          <div className="grid grid-cols-1 gap-6 mb-8" onClick={() => navigateToPokemon(searchResult.id)}>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-lg transform transition-transform hover:scale-105 group">
              <div className="w-24 h-24 mx-auto relative group">
                <img className="w-full h-full object-contain group-hover:animate-wiggle" src={searchResult.sprites.front_default} alt={searchResult.name} />
              </div>
              <h2 className="text-xl font-semibold mt-2 capitalize">{searchResult.name}</h2>
              <p className="text-gray-600">#{searchResult.id}</p>
              <p className="text-gray-600">Type: {searchResult.types.map((type: any) => type.type.name).join(', ')}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pokemons.map((pokemon, index) => {
              const cardClass = "bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-lg transform transition-transform hover:scale-105 group";
              return (
                <div
                  key={pokemon.id}
                  className={cardClass}
                  ref={pokemons.length === index + 1 ? lastPokemonElementRef : null}
                  onClick={() => navigateToPokemon(pokemon.id)}
                >
                  <div className="w-24 h-24 mx-auto relative group">
                    <img className="w-full h-full object-contain group-hover:animate-wiggle" src={pokemon.sprites.front_default} alt={pokemon.name} />
                  </div>
                  <h2 className="text-xl font-semibold mt-2 capitalize">{pokemon.name}</h2>
                  <p className="text-gray-600">#{pokemon.id}</p>
                  <p className="text-gray-600">Type: {pokemon.types.map((type: any) => type.type.name).join(', ')}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Audio element for background music */}
      <audio ref={audioRef} src="/base_audio.mp3" loop />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="fixed bottom-4 right-4 bg-red-500 text-white py-2 px-4 rounded-full shadow-lg focus:outline-none hover:bg-red-600"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      {/* Toggle Camera Button */}
      <button
        onClick={navigateToCamera}
        className="fixed bottom-20 right-4 bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg focus:outline-none hover:bg-blue-600"
      >
        Open Camera
      </button>
    </div>
  );
};

export default Home;
