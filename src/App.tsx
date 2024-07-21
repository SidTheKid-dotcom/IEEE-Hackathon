// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';

const SearchPage = () => <h2>Search Page</h2>;
const ComparePage = () => <h2>Compare Page</h2>;
const PokemonPage = () => <h2>Pokemon Page</h2>;
const MyListPage = () => <h2>My List Page</h2>;
const AboutPage = () => <h2>About Page</h2>;

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/pokemon" element={<PokemonPage />} />
          <Route path="/list" element={<MyListPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
