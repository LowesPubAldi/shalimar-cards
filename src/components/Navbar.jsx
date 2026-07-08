import { NavLink } from 'react-router-dom';

function Navbar () {
  return (
    <nav className="navbar">
      <h1>Shalimar Cards</h1>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>Home</NavLink>
        <NavLink to="/catalog" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Catalog</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About</NavLink>
      </div>
    </nav>
  );    
}

export default Navbar;