import React, { useState } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <button className="hamburger" onClick={toggleMenu}>
        <div style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }} />
        <div style={{ opacity: isOpen ? 0 : 1, transform: isOpen ? 'translateX(20px)' : 'translateX(0)' }} />
        <div style={{ transform: isOpen ? 'rotate(-45deg)' : 'rotate(0)' }} />
      </button>
      <nav className={isOpen ? 'open' : ''}>
        <a href="/">Home</a>
        <a href="/features">Features</a>
        <a href="/technology-stack">Technology Stack</a>
        <a href="/project-structure">Project Structure</a>
        <a href="/setup-installation">Setup and Installation</a>
        <a href="/component-breakdown">Component Breakdown</a>
        <a href="/api-usage">API Usage</a>
        <a href="/screenshots">Screenshots</a>
        <a href="/conclusion">Conclusion</a>
      </nav>
    </header>
  );
};

export default Header;
