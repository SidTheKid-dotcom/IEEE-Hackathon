import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';


interface Question {
    question: string;
    answers: string[];
}

interface Pokemon {
    id: number;
    name: string;
    imageUrl: string;
    soundUrl: string;
}

interface User {
    username: string;
    buddyPokemon?: number;
    buddyPokemonLevel?: number;
    buddyPokemonXP?: number;
}

interface Activity {
    id: number;
    name: string;
    imageUrl: string;
    activity: number;
}

interface PokemonObject {
    pokemonId: number,
    activity: number
}

interface JWTtoken {
    userID: number,
    username: String,
    iat: number
}

const questions: Question[] = [
    // (Questions array remains unchanged)
];

const StarterPokemonPage: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [answerCounts, setAnswerCounts] = useState<number[]>([0, 0, 0]);
    const [chosenPokemon, setChosenPokemon] = useState<Pokemon | null>(null);
    const [level, setLevel] = useState<number>(0);
    const [xp, setXp] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const [topPokemon, setTopPokemon] = useState<Activity[]>([]);
    const [recentPokemon, setRecentPokemon] = useState<any[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchChosenPokemon = async () => {
            setLoading(true);
            try {
                const token = JSON.parse(String(localStorage.getItem('token')));
                if (!token) return;

                const response = await axios.get('http://localhost:3010/getChosenPokemon', {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.data.pokemon) {
                    const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${response.data.pokemon}`);
                    const pokemon = pokemonResponse.data;

                    setChosenPokemon({
                        id: pokemon.id,
                        name: pokemon.name,
                        imageUrl: pokemon.sprites.other['official-artwork'].front_default,
                        soundUrl: `https://play.pokemonshowdown.com/audio/cries/${pokemon.name.toLowerCase()}.mp3`,
                    });

                    setLevel(response.data.level || 0);
                    setXp(response.data.xp || 0);
                }
            } catch (error) {
                console.error('Failed to fetch chosen Pokémon', error);
                setError('Failed to fetch chosen Pokémon');
            } finally {
                setLoading(false);
            }
        };

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const token = JSON.parse(String(localStorage.getItem('token')));
                if (!token) return;

                const decoded = jwtDecode(token) as JWTtoken;

                const userId = decoded.userID;
                const userResponse = await axios.get(`http://localhost:3010/user/${userId}`, {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                });
                setUser(userResponse.data.user);
                setRecentPokemon(userResponse.data.recentPokemon.reverse());

                if (userResponse.data.topPokemon && Array.isArray(userResponse.data.topPokemon)) {

                    const pokemonPromises = userResponse.data.topPokemon.map(async (pokemonObj: PokemonObject) => {
                        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonObj.pokemonId}`);
                        const pokemon = pokemonResponse.data;

                        return {
                            id: pokemon.id,
                            name: pokemon.name,
                            imageUrl: pokemon.sprites.front_default,
                            activity: pokemonObj.activity
                        };
                    });

                    const pokemonDataArray = await Promise.all(pokemonPromises);

                    setTopPokemon(pokemonDataArray);
                }
            } catch (error) {
                console.error('Failed to fetch user data', error);
                setError('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchChosenPokemon();

    }, []);


    const handleAnswer = (answerIndex: number) => {
        const newAnswerCounts = [...answerCounts];
        newAnswerCounts[answerIndex] += 1;
        setAnswerCounts(newAnswerCounts);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            sendAnswers(newAnswerCounts);
        }
    };

    const sendAnswers = async (counts: number[]) => {
        setLoading(true);

        try {
            const token = JSON.parse(String(localStorage.getItem('token')));
            if (!token) {
                setError('No token found');
                return;
            }

            const response = await axios.post(
                'http://localhost:3010/findYourPokemon',
                { counts },
                {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.pokemon) {
                const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${response.data.pokemon}`);
                const pokemon = pokemonResponse.data;

                setChosenPokemon({
                    id: pokemon.id,
                    name: pokemon.name,
                    imageUrl: pokemon.sprites.other['official-artwork'].front_default,
                    soundUrl: `https://play.pokemonshowdown.com/audio/cries/${pokemon.name.toLowerCase()}.mp3`,
                });
            }
        } catch (error) {
            console.error('Failed to find your Pokémon', error);
            setError('Failed to find your Pokémon');
        } finally {
            setLoading(false);
        }
    };

    const handleNavigatePokemon = (id: number) => {
        navigate(`/pokemon/${id}`);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                <h1 className="text-4xl font-bold mb-6 text-center text-white">Which Starter Pokémon Suits You?</h1>
                {error && <p className="text-red-200 mb-4">{error}</p>}
                <div className="text-center">
                    <p className="text-2xl text-white">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex bg-profile-background-image bg-cover">

            {/* Left Section */}
            <div className="w-1/4 p-4 bg-white shadow-xl rounded-lg border border-gray-200">
                
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Username: {user?.username}</h2>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Recently Viewed:</h2>
                {recentPokemon.length > 0 && (
                    <ul className="flex flex-col gap-4">
                        {recentPokemon.map((pokemon, index) => (
                            <li onClick={() => handleNavigatePokemon(pokemon.id)} key={index} className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100">
                                <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-16 h-16 object-cover rounded-full border border-gray-300" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{pokemon.name}</h3>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Middle Section */}
            <div className="w-1/2 p-4 bg-gray-100 flex flex-col items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                    <h2 className="text-2xl font-bold mb-4 text-center">Your Top Pokémon:</h2>
                    {topPokemon.length > 0 ? (
                        <ul className="flex flex-col gap-4">
                            {topPokemon.map((pokemon, index) => (
                                <li
                                    onClick={() => handleNavigatePokemon(pokemon.id)}
                                    key={index}
                                    className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <img src={pokemon.imageUrl} alt={pokemon.name} className="w-16 h-16 object-cover" />
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-bold text-gray-800">{pokemon.name}</h3>
                                        <p className="text-gray-600">Activity: {pokemon.activity}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-600">No top Pokémon available</p>
                    )}
                </div>
            </div>


            {/* Right Section */}
            <div className="w-7/12 p-4">
                {chosenPokemon ? (
                    <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 flex flex-col items-center">
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Your Pokémon</h2>
                        <img src={chosenPokemon.imageUrl} alt={chosenPokemon.name} className="w-48 h-48 rounded-full shadow-lg mb-4 border border-gray-300"  />
                        <p className="text-2xl mt-4 text-gray-700 font-bold">{chosenPokemon.name.toUpperCase()}</p>
                        <div className="mt-6 w-full flex flex-col items-center">
                            <div className="w-full max-w-md flex justify-center items-center">
                                <h3 className="text-xl font-medium text-gray-800">Level&nbsp;</h3>
                                <div className="text-xl font-medium text-gray-800">{level}</div>
                            </div>
                            <div className="w-full max-w-md flex flex-col items-center mt-4">
                                <h3 className="text-xl font-medium text-gray-800">XP</h3>
                                <div className="w-[60%] bg-gray-200 rounded-full h-4 mt-2">
                                    <div className="bg-green-500 h-4 rounded-full" style={{ width: `${xp}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-lg w-full mx-auto">
                        <h2 className="text-2xl font-medium mb-4 text-gray-800">{questions[currentQuestion].question}</h2>
                        <div className="space-y-2">
                            {questions[currentQuestion].answers.map((answer, index) => (
                                <button
                                    key={index}
                                    className={`block w-full py-3 px-6 rounded-lg text-white transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                                        }`}
                                    onClick={() => handleAnswer(index)}
                                    disabled={loading}
                                >
                                    {answer}
                                </button>
                            ))}
                        </div>
                        {loading && <div className="mt-4 text-center text-gray-600">Loading...</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StarterPokemonPage;
