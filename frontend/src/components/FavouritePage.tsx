import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// @ts-ignore
import Particles from './RedParticle.jsx';

import PokeballLoader from './PokeballLoader';

interface Pokemon {
    id: number;
    pokemon_name: string;
    pokemon_id: number;
    imageUrl: string;
    soundUrl: string;
}

const FavouritePage: React.FC = () => {
    const [favorites, setFavorites] = useState<Pokemon[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = JSON.parse(String(localStorage.getItem('token')));

                if (!token) {
                    setError('No token found');
                    return;
                }

                const response = await axios.get('http://localhost:3010/getFavourites', {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                });

                const favs = response.data.favorites;
                console.log(favs);

                const pokemonData = await Promise.all(
                    favs.map(async (fav: { id: number; pokemon_name: string; pokemon_id: number }) => {
                        if (!fav.pokemon_name) {
                            console.warn(`Favorite with id ${fav.id} has no pokemon_name property`);
                            return null;
                        }

                        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${fav.pokemon_name.toLowerCase()}`);
                        const pokemon = pokemonResponse.data;

                        return {
                            id: fav.pokemon_id,
                            pokemon_name: fav.pokemon_name,
                            imageUrl: pokemon.sprites.front_default,
                            soundUrl: `https://play.pokemonshowdown.com/audio/cries/${fav.pokemon_name.toLowerCase()}.mp3`, // Adjust sound URL
                        };
                    })
                );

                // Filter out any null values from the array
                const validPokemonData = pokemonData.filter(pokemon => pokemon !== null) as Pokemon[];

                setFavorites(validPokemonData);
                setTimeout(() => {setLoading(false)}, 500);
            } catch (error) {
                console.error('Failed to fetch favorites', error);
                setError('Failed to fetch favorites');
            }
        };

        fetchFavorites();
    }, []);

    const playSound = (soundUrl: string) => {
        const audio = new Audio(soundUrl);
        audio.play();
    };

    const redirectPokemonPage = (id: number) => {
        console.log(id)
        navigate(`/pokemon/${id}`);
    }

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <PokeballLoader />
            </div>
        )
    }

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <Particles></Particles>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-center text-yellow-500">Favorite Pokémon</h1>
                {error && <p className="text-red-500">{error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {favorites.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg hover:bg-yellow-100 transition duration-300 transform hover:scale-105 cursor-pointer"
                            onClick={() => {
                                console.log(pokemon);
                                redirectPokemonPage(pokemon.id);
                            }}
                        >
                            <img src={pokemon.imageUrl} alt={pokemon.pokemon_name} className="w-24 h-24 mb-4" />
                            <span className="text-xl font-medium text-gray-800">{pokemon.pokemon_name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FavouritePage;
