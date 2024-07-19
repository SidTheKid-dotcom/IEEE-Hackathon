// src/services/pokemonService.ts
import axios from 'axios';

export const getPokemons = async (url: string) => {
  const response = await axios.get(url);
  const results = response.data.results;

  const pokemonDetails = await Promise.all(
    results.map(async (pokemon: any) => {
      const detail = await axios.get(pokemon.url);
      return detail.data;
    })
  );

  return {
    pokemonDetails,
    nextUrl: response.data.next,
  };
};
