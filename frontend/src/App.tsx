import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import CameraPage from './components/CameraPage';
import PokemonCardWrapper from './components/PokemonCardWrapper';
import Navbar from './components/Navbar';

// @ts-ignore
import BuddyPokemon from './components/BuddyPokemon.jsx';
// @ts-ignore
import LoginWrapper from './components/LoginWrapper.jsx';

const App: React.FC = () => {

  return (
    <>
      <Navbar />
      <div className='mt-[3rem]'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="/buddyPokemon" element={<BuddyPokemon />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/pokemon/:id" element={<PokemonCardWrapper />} />
        </Routes>
      </div>
    </>
  );
};

export default App;