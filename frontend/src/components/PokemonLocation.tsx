import React, { useEffect, useState } from 'react';
import axios from 'axios';


interface LocationArea {
    name: string;
    url: string;
}

interface Encounter {
    location_area: LocationArea;
    version_details: unknown[];
}

interface PokemonDetails {
    id: number;
    name: string;
    location_area_encounters: string;
}

const PokemonLocation: React.FC<{ pokemonId: number }> = ({ pokemonId }) => {
    const [locations, setLocations] = useState<LocationArea[]>([]);
    const [pokemonName, setPokemonName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                // Fetch Pokémon details
                const response = await axios.get<PokemonDetails>(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
                setPokemonName(response.data.name);

                // Fetch location area encounters
                const encountersResponse = await axios.get<Encounter[]>(response.data.location_area_encounters);
                setLocations(encountersResponse.data.map(encounter => encounter.location_area).slice(0, 10));

                setLoading(false);
            } catch (error) {
                console.error('Error fetching Pokémon details:', error);
                setError('Failed to fetch Pokémon data.');
                setLoading(false);
            }
        };

        fetchPokemonDetails();
    }, [pokemonId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="pokemon-location ml-[-20rem] z-50 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-center">
                Location Areas for {pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}
            </h2>
            <ul className="list-disc list-inside space-y-2">
                {locations.length > 0 ? (
                    locations.map((location, index) => (
                        <li key={index} className="bg-gray-700 p-2 rounded-md">
                            {location.name.charAt(0).toUpperCase() + location.name.slice(1)}
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-400">No locations found.</p>
                )}
            </ul>
        </div>

    );
};

export default PokemonLocation;
