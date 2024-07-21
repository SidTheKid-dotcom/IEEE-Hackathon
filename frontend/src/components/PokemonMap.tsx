import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PokemonMap.css';

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
    species: {
        name: string;
        url: string;
    };
}

interface PokemonMapProps {
    pokemonId: number;
}

const PokemonMap: React.FC<PokemonMapProps> = ({ pokemonId }) => {
    const [encounters, setEncounters] = useState<Encounter[]>([]);
    const [pokemonName, setPokemonName] = useState<string>('');
    const [pokemonRegion, setPokemonRegion] = useState<string>('');

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                const response = await axios.get<PokemonDetails>(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
                if (response.data) {
                    setPokemonName(response.data.name);
                    const encountersResponse = await axios.get<Encounter[]>(response.data.location_area_encounters);
                    setEncounters(encountersResponse.data);
                    // Extract region from species endpoint
                    if (response.data.species) {
                        const speciesResponse = await axios.get(response.data.species.url);
                        if (speciesResponse.data && speciesResponse.data.generation) {
                            setPokemonRegion(speciesResponse.data.generation.name);
                        }
                    }
                } else {
                    console.error('Pokemon data not found:', response.data);
                }
            } catch (error) {
                console.error('Error fetching Pokémon details:', error);
            }
        };

        fetchPokemonDetails();
    }, [pokemonId]);

    const markerIconsByGeneration: { [key: string]: { [key: string]: string } } = {
        'generation-i': {
            'pallet-town-area': 'marker_icon.png',
            'viridian-city-area': '/public/marker_icon.png',
            // Add other Generation I locations
        },
        'generation-ii': {
            'new-bark-town-area': '/public/marker_icon.png',
            'cherrygrove-city-area': '/public/marker_icon.png',
            // Add other Generation II locations
        },
        'generation-iii': {
            'littleroot-town-area': '/public/marker_icon.png',
            'oldale-town-area': '/public/marker_icon.png',
            // Add other Generation III locations
        },
        // Add other generations as needed
    };

    const locationStylesByGeneration: { [key: string]: { [key: string]: { top: string; left: string } } } = {
        'generation-i': {
            'pallet-town-area': { top: '68%', left: '18%' },
            'viridian-city-area': { top: '75%', left: '7%' },
            // Add other Generation I locations
        },
        'generation-ii': {
            'new-bark-town-area': { top: '80%', left: '92%' },
            'cherrygrove-city-area': { top: '75%', left: '84%' },
            // Add other Generation II locations
        },
        'generation-iii': {
            'littleroot-town-area': { top: '85%', left: '22%' },
            'oldale-town-area': { top: '79%', left: '32%' },
            // Add other Generation III locations
        },
        // Add other generations as needed
    };

    const getMarkerIcon = (locationAreaName: string): string | null => {
        const generationIcons = markerIconsByGeneration[pokemonRegion];
        return generationIcons ? generationIcons[locationAreaName] || null : null;
    };

    const getHighlightStyle = (locationAreaName: string): { top: string; left: string } => {
        const generationStyles = locationStylesByGeneration[pokemonRegion];
        return generationStyles ? generationStyles[locationAreaName] || { top: '0', left: '0' } : { top: '0', left: '0' };
    };

    return (
        <div className="map-container">
            {pokemonRegion && <h2>{pokemonRegion} Region</h2>}
            {pokemonName && <h3>{pokemonName}</h3>}
            
            {pokemonRegion && <img src={`/${pokemonRegion}_Map.jpg`} alt={`${pokemonRegion} Region Map`} className="map-image" />}
            {encounters.map((encounter, index) => {
                const markerIcon = getMarkerIcon(encounter.location_area.name);
                const style = getHighlightStyle(encounter.location_area.name);
                if (markerIcon) {
                    return (
                        <div key={index} style={{ position: 'absolute', top: style.top, left: style.left, textAlign: 'center' }}>
                            <img
                                src={markerIcon}
                                alt={encounter.location_area.name}
                                style={{ width: '32px', height: '32px' }}
                            />
                            <div className="location_name">{encounter.location_area.name}</div>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default PokemonMap;
