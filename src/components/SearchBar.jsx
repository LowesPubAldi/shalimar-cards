function SearchBar ({ search, setSearch }) {
    return (
        <div>
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