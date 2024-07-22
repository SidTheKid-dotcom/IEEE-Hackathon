// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
// import Sidebar from './components/Sidebar';
import Home from './pages/Home'; 
import Features from './pages/Features';
import TechnologyStack from './pages/TechnologyStack';
import ProjectStructure from './pages/ProjectStructure';
import SetupInstallation from './pages/SetupInstallation';
import ComponentBreakdown from './pages/ComponentBreakdown';
import ApiUsage from './pages/ApiUsage';
import Screenshots from './pages/Screenshots';
import Conclusion from './pages/Conclusion';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <div className="layout">
        
        <main className="main-content">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/features" component={Features} />
            <Route path="/technology-stack" component={TechnologyStack} />
            <Route path="/project-structure" component={ProjectStructure} />
            <Route path="/setup-installation" component={SetupInstallation} />
            <Route path="/component-breakdown" component={ComponentBreakdown} />
            <Route path="/api-usage" component={ApiUsage} />
            <Route path="/screenshots" component={Screenshots} />
            <Route path="/conclusion" component={Conclusion} />
          </Switch>
        </main>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
