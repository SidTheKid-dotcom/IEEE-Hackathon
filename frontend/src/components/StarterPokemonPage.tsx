import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

const questions: Question[] = [
    {
        question: "You find a mysterious egg, what do you do?",
        answers: ["Carefully nurture it with plants", "Keep it warm and protected", "Place it in a safe, water-filled basin"],
    },
    {
        question: "Which of these activities sounds most appealing to you?",
        answers: ["Creating a small garden in your backyard", "Building a cozy campfire and cooking outdoors", "Crafting a small boat and sailing it on a pond"],
    },
    {
        question: "In a group project, what role do you usually take?",
        answers: ["The planner who organizes and gathers resources", "The motivator who keeps everyone energetic and focused", "The mediator who ensures smooth communication and harmony"],
    },
    {
        question: "How would your friends describe your personality?",
        answers: ["Steady and reliable", "Enthusiastic and dynamic", "Calm and adaptable"],
    },
    {
        question: "What kind of book would you most likely pick up?",
        answers: ["A guide on herbal remedies", "An adventure novel", "A book on marine life"],
    },
    {
        question: "Which of these best describes your ideal vacation?",
        answers: ["Visiting botanical gardens and nature reserves", "Hiking up scenic mountains and exploring caves", "Relaxing on a beach and exploring underwater reefs"],
    },
    {
        question: "How do you react to sudden changes in plans?",
        answers: ["Adjust calmly and come up with a new plan", "Tackle the changes with enthusiasm and energy", "Go with the flow and adapt as needed"],
    },
    {
        question: "Which quote resonates most with you?",
        answers: ["Growth is a slow process, but it’s worth it.", "Life is an adventure, embrace it with all your heart.", "Stay calm and let the current guide you."],
    },
    {
        question: "Which of these elements do you feel most connected to?",
        answers: ["Earth", "Fire", "Water"],
    },
    {
        question: "If you could have any superpower, what would it be?",
        answers: ["The ability to control plants and nature", "The power to create and control fire", "The ability to breathe underwater and control water"],
    },
];

const StarterPokemonPage: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [answerCounts, setAnswerCounts] = useState<number[]>([0, 0, 0]);
    const [chosenPokemon, setChosenPokemon] = useState<Pokemon | null>(null);
    const [level, setLevel] = useState<number>(0);
    const [xp, setXp] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">Which Starter Pokémon Suits You?</h1>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            {loading ? (
                <div className="text-center">
                    <p className="text-2xl text-gray-600">Loading...</p>
                </div>
            ) : chosenPokemon ? (
                <div className="text-center">
                    <h2 className="text-3xl font-semibold mb-4">Your Pokémon</h2>
                    <img src={chosenPokemon.imageUrl} alt={chosenPokemon.name} className="w-48 h-48 mx-auto rounded-lg shadow-lg" />
                    <p className="text-2xl mt-4 text-gray-700 font-bold">{chosenPokemon.name.toUpperCase()}</p>

                    <div className="mt-6">
                        <div className='flex flex-row justify-center'>
                            <h3 className="text-xl font-medium mb-2">Level&nbsp;</h3>
                            <div className='text-xl font-medium mb-2'>
                                {level}
                            </div>
                        </div>
                        <h3 className="text-xl font-medium mt-4 mb-2">XP</h3>
                        <div className="w-full bg-gray-200 rounded-full">
                            <div
                                className="bg-green-500 text-xs font-medium text-green-100 text-center p-0.5 leading-none rounded-full"
                                style={{ width: `${xp}%` }}
                            >
                                {xp}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
                    <h2 className="text-2xl font-medium mb-4">{questions[currentQuestion].question}</h2>
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
    );
};

export default StarterPokemonPage;
