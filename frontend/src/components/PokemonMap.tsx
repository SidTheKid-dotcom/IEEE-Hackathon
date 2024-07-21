import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PokemonMap.css';

// Define interfaces for location areas and encounters
interface LocationArea {
    name: string;
    url: string;
}

interface Encounter {
    location_area: LocationArea;
    version_details: any[];
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
                    console.log(encountersResponse.data);
                } else {
                    console.error('Pokemon data not found:', response.data);
                }
            } catch (error) {
                console.error('Error fetching Pokémon details:', error);
            }
        };

        fetchPokemonDetails();
    }, [pokemonId]);

    const getMarkerIcon = (locationAreaName: string): string | null => {
        // Example mapping of marker icons/images for different regions
        const markerIcons: { [key: string]: string } = {
            'pallet-town-area': '/public/marker_icon.png',
            'cerulean-city-area': '/public/marker_icon.png',
            // Add more mappings for other locations in this region
        };

        // Return null if locationAreaName is not found in markerIcons
        return markerIcons[locationAreaName] || null;
    };

    const getHighlightStyle = (locationAreaName: string): { top: string; left: string } => {
        // Example mapping of location styles for different regions
        const locationStyles: { [key: string]: { top: string; left: string } } = {
            'pallet-town-area': { top: '78%', left: '28%' },
            'cerulean-city-area': { top: '17%', left: '61%' },
            // Add more mappings for other locations in this region
        };

        // Default position if location not found
        return locationStyles[locationAreaName] || { top: '0', left: '0' };
    };

    return (
        <div className="map-container">
            {pokemonRegion && <h2>{pokemonRegion} Region</h2>}
            {pokemonName && <h3>{pokemonName}</h3>}
            {/* Render the map image based on the fetched region */}
            {pokemonRegion && <img src={`/${pokemonRegion}_Map.png`} alt={`${pokemonRegion} Region Map`} className="map-image" />}
            {encounters.map((encounter, index) => {
                const markerIcon = getMarkerIcon(encounter.location_area.name);
                const style = getHighlightStyle(encounter.location_area.name);
                // Only render marker if markerIcon exists
                if (markerIcon) {
                    return (
                        <img
                            key={index}
                            src={markerIcon}
                            alt={encounter.location_area.name}
                            style={{ position: 'absolute', top: style.top, left: style.left, width: '32px', height: '32px' }}
                        />
                    );
                }
                return null; // Render nothing if markerIcon is null
            })}
        </div>
    );
};

export default PokemonMap;
