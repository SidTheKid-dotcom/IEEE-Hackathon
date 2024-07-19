// src/components/LandingPage.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getPokemons } from '../services/pokemonService';
import axios from 'axios';

const Home: React.FC = () => {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [allPokemons, setAllPokemons] = useState<any[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>('https://pokeapi.co/api/v2/pokemon?limit=100');
  const [sortOption, setSortOption] = useState<string>('number');
  const [filterType, setFilterType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const observer = useRef<IntersectionObserver>();

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

  const sortPokemons = (pokemons: any[]) => {
    if (sortOption === 'number') {
      return pokemons.sort((a, b) => a.id - b.id);
    } else if (sortOption === 'type') {
      return pokemons.sort((a, b) => a.types[0].type.name.localeCompare(b.types[0].type.name));
    }
    return pokemons;
  };

  const filterPokemons = (pokemons: any[]) => {
    if (filterType) {
      return pokemons.filter((pokemon) => pokemon.types.some((type: any) => type.type.name === filterType));
    }
    return pokemons;
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
  }, [allPokemons, sortOption, filterType]);

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

  return (
    <div className="bg-white text-black font-sans">
      <div className="container mx-auto text-center py-8">
        <h1 className="text-4xl font-bold text-red-500 mb-8">Pokédex</h1>
        <div className="flex justify-center mb-8">
          <div className="mr-4">
            <label className="block text-sm font-medium text-gray-700">Sort by</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            >
              <option value="number">Number</option>
              <option value="type">Type</option>
            </select>
          </div>
          <div className="mr-4">
            <label className="block text-sm font-medium text-gray-700">Filter by Type</label>
            <input
              type="text"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value.toLowerCase())}
              placeholder="Type (e.g., grass)"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              placeholder="Name or Number"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
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
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-lg transform transition-transform hover:scale-105">
              <img className="w-24 h-24 mx-auto" src={searchResult.sprites.front_default} alt={searchResult.name} />
              <h2 className="text-xl font-semibold mt-2 capitalize">{searchResult.name}</h2>
              <p className="text-gray-600">#{searchResult.id}</p>
              <p className="text-gray-600">Type: {searchResult.types.map((type: any) => type.type.name).join(', ')}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pokemons.map((pokemon, index) => {
              if (pokemons.length === index + 1) {
                return (
                  <div
                    key={pokemon.id}
                    ref={lastPokemonElementRef}
                    className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-lg transform transition-transform hover:scale-105"
                  >
                    <img className="w-24 h-24 mx-auto" src={pokemon.sprites.front_default} alt={pokemon.name} />
                    <h2 className="text-xl font-semibold mt-2 capitalize">{pokemon.name}</h2>
                    <p className="text-gray-600">#{pokemon.id}</p>
                    <p className="text-gray-600">Type: {pokemon.types.map((type: any) => type.type.name).join(', ')}</p>
                  </div>
                );
              } else {
                return (
                  <div
                    key={pokemon.id}
                    className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-lg transform transition-transform hover:scale-105"
                  >
                    <img className="w-24 h-24 mx-auto" src={pokemon.sprites.front_default} alt={pokemon.name} />
                    <h2 className="text-xl font-semibold mt-2 capitalize">{pokemon.name}</h2>
                    <p className="text-gray-600">#{pokemon.id}</p>
                    <p className="text-gray-600">Type: {pokemon.types.map((type: any) => type.type.name).join(', ')}</p>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
