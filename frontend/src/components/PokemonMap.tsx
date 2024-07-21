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

    const getMarkerIcon = (locationAreaName: string): string | null => {
        const markerIcons: { [key: string]: string } = {
            'pallet-town-area': 'marker_icon.png',
            'viridian-city-area': '/public/marker_icon.png',
            'pewter-city-area': '/public/marker_icon.png',
            'cerulean-city-area': '/public/marker_icon.png',
            'vermillion-city-area': '/public/marker_icon.png',
            'lavender-town-area': '/public/marker_icon.png',
            'celadon-city-area': '/public/marker_icon.png',
            'fuchsia-city-area': '/public/marker_icon.png',
            'saffron-city-area': '/public/marker_icon.png',
            'cinnabar-island-area': '/public/marker_icon.png',
            // Generation 2 (Johto)
            'new-bark-town-area': '/public/marker_icon.png',
            'cherrygrove-city-area': '/public/marker_icon.png',
            'violet-city-area': '/public/marker_icon.png',
            'azalea-town-area': '/public/marker_icon.png',
            'goldenrod-city-area': '/public/marker_icon.png',
            'ecruteak-city-area': '/public/marker_icon.png',
            'olivine-city-area': '/public/marker_icon.png',
            'cianwood-city-area': '/public/marker_icon.png',
            'mahogany-town-area': '/public/marker_icon.png',
            'blackthorn-city-area': '/public/marker_icon.png',
            // Generation 3 (Hoenn)
            'littleroot-town-area': '/public/marker_icon.png',
            'oldale-town-area': '/public/marker_icon.png',
            'petalburg-city-area': '/public/marker_icon.png',
            'rustboro-city-area': '/public/marker_icon.png',
            'dewford-town-area': '/public/marker_icon.png',
            'slateport-city-area': '/public/marker_icon.png',
            'mauville-city-area': '/public/marker_icon.png',
            'verdanturf-town-area': '/public/marker_icon.png',
            'fallarbor-town-area': '/public/marker_icon.png',
            'lavaridge-town-area': '/public/marker_icon.png',
            'fortree-city-area': '/public/marker_icon.png',
            'lilycove-city-area': '/public/marker_icon.png',
            'mossdeep-city-area': '/public/marker_icon.png',
            'sootopolis-city-area': '/public/marker_icon.png',
            'pacifidlog-town-area': '/public/marker_icon.png',
            'ever-grande-city-area': '/public/marker_icon.png',
            // Generation 4 (Sinnoh)
            'twinleaf-town-area': '/public/marker_icon.png',
            'sandgem-town-area': '/public/marker_icon.png',
            'jubilife-city-area': '/public/marker_icon.png',
            'oreburgh-city-area': '/public/marker_icon.png',
            'floaroma-town-area': '/public/marker_icon.png',
            'eterna-city-area': '/public/marker_icon.png',
            'hearthome-city-area': '/public/marker_icon.png',
            'solaceon-town-area': '/public/marker_icon.png',
            'veilstone-city-area': '/public/marker_icon.png',
            'pastoria-city-area': '/public/marker_icon.png',
            'celestic-town-area': '/public/marker_icon.png',
            'canalave-city-area': '/public/marker_icon.png',
            'snowpoint-city-area': '/public/marker_icon.png',
            'sunnyshore-city-area': '/public/marker_icon.png',
            // Generation 5 (Unova)
            'nuvema-town-area': '/public/marker_icon.png',
            'accumula-town-area': '/public/marker_icon.png',
            'striaton-city-area': '/public/marker_icon.png',
            'nacrene-city-area': '/public/marker_icon.png',
            'castelia-city-area': '/public/marker_icon.png',
            'nimbasa-city-area': '/public/marker_icon.png',
            'driftveil-city-area': '/public/marker_icon.png',
            'mistralton-city-area': '/public/marker_icon.png',
            'icirrus-city-area': '/public/marker_icon.png',
            'opelucid-city-area': '/public/marker_icon.png',
            'lacunosa-town-area': '/public/marker_icon.png',
            'undella-town-area': '/public/marker_icon.png',
            'black-city-area': '/public/marker_icon.png',
            'white-forest-area': '/public/marker_icon.png',
            // Generation 6 (Kalos)
            'vaniville-town-area': '/public/marker_icon.png',
            'aquacorde-town-area': '/public/marker_icon.png',
            'santalune-city-area': '/public/marker_icon.png',
            'lumiose-city-area': '/public/marker_icon.png',
            'camphrier-town-area': '/public/marker_icon.png',
            'ambrette-town-area': '/public/marker_icon.png',
            'cyllage-city-area': '/public/marker_icon.png',
            'geosenge-town-area': '/public/marker_icon.png',
            'shalour-city-area': '/public/marker_icon.png',
            'coumarine-city-area': '/public/marker_icon.png',
            'laverre-city-area': '/public/marker_icon.png',
            'dendemille-town-area': '/public/marker_icon.png',
            'anistar-city-area': '/public/marker_icon.png',
            'couriway-town-area': '/public/marker_icon.png',
            'snowbelle-city-area': '/public/marker_icon.png',
            // Generation 7 (Alola)
            'iki-town-area': '/public/marker_icon.png',
            'hau-oli-city-area': '/public/marker_icon.png',
            'heahea-city-area': '/public/marker_icon.png',
            'paniola-town-area': '/public/marker_icon.png',
            'konikoni-city-area': '/public/marker_icon.png',
            'aether-paradise-area': '/public/marker_icon.png',
            'malie-city-area': '/public/marker_icon.png',
            'tapu-village-area': '/public/marker_icon.png',
            'seafolk-village-area': '/public/marker_icon.png',
            // Generation 8 (Galar)
            'postwick-area': '/public/marker_icon.png',
            'wedgehurst-area': '/public/marker_icon.png',
            'motostoke-area': '/public/marker_icon.png',
            'turffield-area': '/public/marker_icon.png',
            'hulbury-area': '/public/marker_icon.png',
            'hammerlocke-area': '/public/marker_icon.png',
            'stow-on-side-area': '/public/marker_icon.png',
            'ballonlea-area': '/public/marker_icon.png',
            'circhester-area': '/public/marker_icon.png',
            'spikemuth-area': '/public/marker_icon.png',
            'wyndon-area': '/public/marker_icon.png',
        };

        return markerIcons[locationAreaName] || null;
    };

    const getHighlightStyle = (locationAreaName: string): { top: string; left: string } => {
        const locationStyles: { [key: string]: { top: string; left: string } } = {
            'pallet-town-area': { top: '68%', left: '18%' },
        
           'viridian-city-area': { top: '75%', left: '7%' },
        'pewter-city-area': { top: '20%', left: '18%' },
        'cerulean-city-area': { top: '22%', left: '65%' },
         'vermillion-city-area': { top: '74%', left: '27%' },
        'lavender-town-area': { top: '49%', left: '39%' },
        'celadon-city-area': { top: '56%', left: '20%' },
        'fuchsia-city-area': { top: '86%', left: '31%' },
        'saffron-city-area': { top: '56%', left: '29%' },
        'cinnabar-island-area': { top: '97%', left: '7%' },
        'power-plant-area': { top: '20%', left: '51%' },
        'seafoam-islands-area': { top: '86%', left: '61%' },
        'rock-tunnel-area': { top: '39%', left: '42%' },
        'victory-road-area': { top: '7%', left: '23%' },
        'pokemon-league-area': { top: '5%', left: '24%' },
            // Generation 2 (Johto)
         'new-bark-town': { top: '80%', left: '92%' },
        'cherrygrove-city': { top: '75%', left: '84%' },
        'violet-city': { top: '55%', left: '65%' },
        'azalea-town': { top: '73%', left: '65%' },
        'goldenrod-city': { top: '64%', left: '56%' },
        'ecruteak-city': { top: '46%', left: '55%' },
        'olivine-city': { top: '50%', left: '40%' },
        'cianwood-city': { top: '67%', left: '25%' },
        'mahogany-town': { top: '33%', left: '75%' },
        'blackthorn-city': { top: '30%', left: '87%' },
            // Generation 3 (Hoenn)
            'littleroot-town-area': { top: '85%', left: '22%' },
            'oldale-town-area': { top: '79%', left: '32%' },
            'petalburg-city-area': { top: '72%', left: '25%' },
            'rustboro-city-area': { top: '60%', left: '28%' },
            'dewford-town-area': { top: '90%', left: '19%' },
            'slateport-city-area': { top: '83%', left: '36%' },
            'mauville-city-area': { top: '70%', left: '48%' },
            'verdanturf-town-area': { top: '64%', left: '42%' },
            'fallarbor-town-area': { top: '45%', left: '26%' },
            'lavaridge-town-area': { top: '54%', left: '39%' },
            'fortree-city-area': { top: '41%', left: '50%' },
            'lilycove-city-area': { top: '58%', left: '69%' },
            'mossdeep-city-area': { top: '50%', left: '87%' },
            'sootopolis-city-area': { top: '66%', left: '66%' },
            'pacifidlog-town-area': { top: '74%', left: '12%' },
            'ever-grande-city-area': { top: '95%', left: '85%' },
            // Generation 4 (Sinnoh)
            'twinleaf-town-area': { top: '85%', left: '30%' },
            'sandgem-town-area': { top: '79%', left: '36%' },
            'jubilife-city-area': { top: '72%', left: '31%' },
            'oreburgh-city-area': { top: '70%', left: '38%' },
            'floaroma-town-area': { top: '60%', left: '30%' },
            'eterna-city-area': { top: '54%', left: '38%' },
            'hearthome-city-area': { top: '58%', left: '54%' },
            'solaceon-town-area': { top: '48%', left: '52%' },
            'veilstone-city-area': { top: '44%', left: '60%' },
            'pastoria-city-area': { top: '63%', left: '64%' },
            'celestic-town-area': { top: '37%', left: '48%' },
            'canalave-city-area': { top: '72%', left: '23%' },
            'snowpoint-city-area': { top: '14%', left: '52%' },
            'sunnyshore-city-area': { top: '53%', left: '82%' },
            // Generation 5 (Unova)
            'nuvema-town-area': { top: '95%', left: '28%' },
            'accumula-town-area': { top: '90%', left: '29%' },
            'striaton-city-area': { top: '83%', left: '40%' },
            'nacrene-city-area': { top: '76%', left: '48%' },
            'castelia-city-area': { top: '70%', left: '68%' },
            'nimbasa-city-area': { top: '60%', left: '75%' },
            'driftveil-city-area': { top: '55%', left: '68%' },
            'mistralton-city-area': { top: '50%', left: '60%' },
            'icirrus-city-area': { top: '45%', left: '50%' },
            'opelucid-city-area': { top: '40%', left: '58%' },
            'lacunosa-town-area': { top: '35%', left: '72%' },
            'undella-town-area': { top: '50%', left: '82%' },
            'black-city-area': { top: '25%', left: '70%' },
            'white-forest-area': { top: '55%', left: '70%' },
            // Generation 6 (Kalos)
            'vaniville-town-area': { top: '85%', left: '40%' },
            'aquacorde-town-area': { top: '77%', left: '42%' },
            'santalune-city-area': { top: '70%', left: '52%' },
            'lumiose-city-area': { top: '61%', left: '45%' },
            'camphrier-town-area': { top: '80%', left: '26%' },
            'ambrette-town-area': { top: '58%', left: '30%' },
            'cyllage-city-area': { top: '62%', left: '18%' },
            'geosenge-town-area': { top: '46%', left: '20%' },
            'shalour-city-area': { top: '37%', left: '23%' },
            'coumarine-city-area': { top: '44%', left: '40%' },
            'laverre-city-area': { top: '38%', left: '52%' },
            'dendemille-town-area': { top: '50%', left: '58%' },
            'anistar-city-area': { top: '55%', left: '70%' },
            'couriway-town-area': { top: '55%', left: '70%' },
            'snowbelle-city-area': { top: '55%', left: '70%' },
            // Generation 7 (Alola)
            'iki-town-area': { top: '85%', left: '40%' },
            'hau-oli-city-area': { top: '77%', left: '42%' },
            'heahea-city-area': { top: '70%', left: '52%' },
            'paniola-town-area': { top: '61%', left: '45%' },
            'konikoni-city-area': { top: '80%', left: '26%' },
            'aether-paradise-area': { top: '58%', left: '30%' },
            'malie-city-area': { top: '62%', left: '18%' },
            'tapu-village-area': { top: '46%', left: '20%' },
            'seafolk-village-area': { top: '37%', left: '23%' },
            // Generation 8 (Galar)
            'postwick-area': { top: '85%', left: '40%' },
            'wedgehurst-area': { top: '77%', left: '42%' },
            'motostoke-area': { top: '70%', left: '52%' },
            'turffield-area': { top: '61%', left: '45%' },
            'hulbury-area': { top: '80%', left: '26%' },
            'hammerlocke-area': { top: '58%', left: '30%' },
            'stow-on-side-area': { top: '62%', left: '18%' },
            'ballonlea-area': { top: '46%', left: '20%' },
            'circhester-area': { top: '37%', left: '23%' },
            'spikemuth-area': { top: '44%', left: '40%' },
            'wyndon-area': { top: '38%', left: '52%' },
        };

        return locationStyles[locationAreaName] || { top: '0', left: '0' };
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