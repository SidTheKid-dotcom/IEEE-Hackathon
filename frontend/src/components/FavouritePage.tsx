import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

    const redirectPokemonPage = (id:number) => {
        console.log(id)
        navigate(`/pokemon/${id}`);
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Favorite Pokémon</h1>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-4">
                {favorites.map((pokemon) => (
                    <li
                        key={pokemon.id}
                        className="flex items-center space-x-4 p-2 bg-white shadow-md rounded-lg hover:bg-gray-100 cursor-pointer"
                        //onMouseEnter={() => playSound(pokemon.soundUrl)}
                        onClick={() =>{
                            console.log(pokemon);
                            redirectPokemonPage(pokemon.id)}}
                    >
                        <img src={pokemon.imageUrl} alt={pokemon.pokemon_name} className="w-16 h-16" />
                        <span className="text-xl font-medium">{pokemon.pokemon_name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FavouritePage;
