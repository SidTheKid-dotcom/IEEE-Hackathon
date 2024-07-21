// src/services/pokemonService.ts
import axios from 'axios';

export const getPokemons = async (url: string) => {
  try {
    const response = await axios.get(url);
    const results = response.data.results;

    const pokemonDetails = await Promise.all(
      results.map(async (pokemon: any) => {
        try {
          const detail = await axios.get(pokemon.url);
          return detail.data;
        } catch (error) {
          console.error(`Failed to fetch details for ${pokemon.name}:`, error);
          return null; // Return null if fetching details fails
        }
      })
    );

    return {
      pokemonDetails: pokemonDetails.filter(Boolean), // Filter out null values
      nextUrl: response.data.next,
    };
  } catch (error) {
    console.error('Failed to fetch pokemons:', error);
    return { pokemonDetails: [], nextUrl: null };
  }
};
