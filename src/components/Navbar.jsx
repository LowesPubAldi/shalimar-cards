import { Link } from 'react-router-dom';

function Navbar () {
  return (
    <nav classname="navbar">
      <h1>Shalimar Cards</h1>

      <div classname="nav-links">
        <Link to="/">Home</Link>
        <Link to="/catalog">Catalog</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );    
}

export default Navbar;