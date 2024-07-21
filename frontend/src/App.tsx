// src/App.tsx
import React from 'react';
import PokemonMap from './components/PokemonMap';
import PokemonLocation from './components/PokemonLocation';
import './App.css'

const App: React.FC = () => {

  return (
    <div className="App">
      <video src='../public/video.mp4' autoPlay muted loop playsInline className='absolute top-0 left-0 w-full h-full object-cover -z-10'></video>
    <div className='bg-opacity-50 bg-white w-screen h-screen'>

      <h1 className="Title font-bold text-6xl">Pokémon Habitat</h1>
      <div className='flex justify-center items-center '>

      <span>
        <PokemonMap pokemonId={55}/>
        </span>
        <span className='max-h-screen overflow-x-hidden overflow-y-scroll'>
      <PokemonLocation  pokemonId={55}/>
        </span>
      </div>
    </div>
      </div>
    
  );
};

export default App;