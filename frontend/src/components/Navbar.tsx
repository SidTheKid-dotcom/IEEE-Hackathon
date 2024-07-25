import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import pokeballIcon from '../assets/pokeball-icon.png';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationRoutes = [
    { name: 'Search', route: '/' },
    {name:'Buddy Pokemon',route: '/buddyPokemon'},
   
    {name:'PokeCam',route:'/camera'},
    {name:'Favourites',route:'/favouritePokemon'},
    {name:'My Pokemon',route:'/my-pokemon'},
    { name: 'Documentation', route: 'https://ieee-hackathon-docs.vercel.app/' },
  ];

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-logo">
          <img src={pokeballIcon} alt="Pokeball Icon" />
        </div>
        <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          {navigationRoutes.map(({ name, route }, index) => (
            <li className="nav-item" key={index}>
              <NavLink
                to={route}
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <GiHamburgerMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;