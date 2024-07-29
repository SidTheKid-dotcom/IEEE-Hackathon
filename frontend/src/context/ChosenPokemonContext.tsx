import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Pokemon {
    id: number;
    name: string;
    imageUrl: string;
    soundUrl: string;
}

interface ChosenPokemonContextType {
    chosenPokemon: Pokemon | null;
    setChosenPokemon: (pokemon: Pokemon | null) => void;
}

const ChosenPokemonContext = createContext<ChosenPokemonContextType | undefined>(undefined);

export const ChosenPokemonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [chosenPokemon, setChosenPokemon] = useState<Pokemon | null>(null);

    return (
        <ChosenPokemonContext.Provider value={{ chosenPokemon, setChosenPokemon }}>
            {children}
        </ChosenPokemonContext.Provider>
    );
};

export const useChosenPokemon = (): ChosenPokemonContextType => {
    const context = useContext(ChosenPokemonContext);
    if (!context) {
        throw new Error('useChosenPokemon must be used within a ChosenPokemonProvider');
    }
    return context;
};
