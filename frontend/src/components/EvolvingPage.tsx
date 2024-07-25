import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Pokemon {
    id: number;
    name: string;
    imageUrl: string;
}

interface EvolvingPageProps {
    prevPokemon: string;
    newPokemon: string;
    setIsEvolving: React.Dispatch<React.SetStateAction<{
        evolving: boolean,
        prevPokemon: string,
        newPokemon: string
    }>>;
}

const EvolvingPage: React.FC<EvolvingPageProps> = ({ prevPokemon, newPokemon, setIsEvolving }) => {
    const [prevPokemonData, setPrevPokemonData] = useState<Pokemon | null>(null);
    const [newPokemonData, setNewPokemonData] = useState<Pokemon | null>(null);
    const [evolving, setEvolving] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPokemonData = async () => {
            try {
                const prevResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${prevPokemon}`);
                const newResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${newPokemon}`);

                setPrevPokemonData({
                    id: prevResponse.data.id,
                    name: prevResponse.data.name,
                    imageUrl: prevResponse.data.sprites.other['official-artwork'].front_default,
                });

                setNewPokemonData({
                    id: newResponse.data.id,
                    name: newResponse.data.name,
                    imageUrl: newResponse.data.sprites.other['official-artwork'].front_default,
                });

                // Play evolution sound
                const audio = new Audio('https://play.pokemonshowdown.com/audio/cries/evolution.mp3');
                audio.play();

                // Set evolving to false after the evolution animation
                setTimeout(() => setEvolving(false), 5000); // 5 seconds for evolution animation
            } catch (error) {
                console.error('Failed to fetch Pokémon data', error);
            }
        };

        fetchPokemonData();
    }, [prevPokemon, newPokemon]);

    const navigatePrevPage = () => {
        setIsEvolving({ evolving: false, prevPokemon: '', newPokemon: '' });
    }

    const navigatePokemonPage = () => {
        navigate('/my-pokemon');
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            {evolving ? (
                <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                        <img
                            src={prevPokemonData?.imageUrl}
                            alt={prevPokemonData?.name}
                            className="w-32 h-32 animate-evolve"
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50 rounded-full animate-flash"></div>
                    </div>
                    <div className="mt-4 text-xl">What? {prevPokemonData?.name} is evolving!</div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <img
                        src={newPokemonData?.imageUrl}
                        alt={newPokemonData?.name}
                        className="w-32 h-32"
                    />
                    <div className="mt-4 text-xl">{prevPokemonData?.name.toUpperCase()} evolved into {newPokemonData?.name.toUpperCase()}!</div>
                    <div className="mt-4 space-x-4">
                        <button 
                            onClick={navigatePrevPage} 
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-800"
                        >
                            Go Back
                        </button>
                        <button 
                            onClick={navigatePokemonPage} 
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800"
                        >
                            View {newPokemonData?.name.toUpperCase()}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EvolvingPage;
