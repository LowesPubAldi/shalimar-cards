import {FaSearch} from "react-icons/fa"

function SearchBar ({ search, setSearch }) {
    return (
        <div className="search-bar-container">
            <FaSearch className="search-icon"/>
            <label className="sr-only" htmlFor="card-search">Search cards</label>
            
            <input 
            id="card-search"
            type="text" 
            placeholder="Search Cards..." 
            aria-label="Search cards by name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            />
        </div>
    );
}

export default SearchBar;