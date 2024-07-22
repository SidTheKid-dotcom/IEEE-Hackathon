import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PokemonLocation.css'; 


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
                setLocations(encountersResponse.data.map(encounter => encounter.location_area));

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
        <div className="pokemon-location">
            <h2>Location Areas for {pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h2>
            <ul>
                {locations.length > 0 ? (
                    locations.map((location, index) => (
                        <li key={index}>{location.name.charAt(0).toUpperCase() + location.name.slice(1)}</li>
                    ))
                ) : (
                    <p>No locations found.</p>
                )}
            </ul>
        </div>
    );
};

export default PokemonLocation;
