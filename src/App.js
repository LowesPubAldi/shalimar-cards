import './App.css';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import About from './pages/About.jsx';
import CardDetails from './pages/CardDetails.jsx'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/about" element={<About />} />
        <Route path="/card/:id" element={<CardDetails />} />
      </Routes>
      <Footer />
    </Router>)
};

export default App;