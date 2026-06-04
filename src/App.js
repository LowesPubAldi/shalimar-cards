import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';
import FeaturedCard from './components/FeaturedCard.jsx';
import Footer from './components/Footer.jsx';
import Cardgrid from './components/Cardgrid.jsx';
import Card from './components/Card.jsx';
import SearchBar from './components/SearchBar.jsx';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import About from './pages/About.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </Router>)
};

export default App;