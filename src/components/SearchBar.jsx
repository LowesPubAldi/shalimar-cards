import {FaSearch} from "react-icons/fa"

function SearchBar ({ search, setSearch }) {
    return (
        <div className="search-bar-container">
            <FaSearch className="search-icon"/>
            
            <input 
            type="text" 
            placeholder="Search Cards..." 
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            />
        </div>
    );
}

export default SearchBar;