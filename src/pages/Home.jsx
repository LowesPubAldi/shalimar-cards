import { useState } from 'react';
import FeaturedCard from '../components/FeaturedCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CardGrid from '../components/Cardgrid.jsx';
function Home() {
    const [search, setSearch] = useState('');

    return ( 
        <>
        <div className="hero-section">
            <div className="hero-left">
                <FeaturedCard/>
        </div>

        <div className="hero-search">
        <SearchBar
        search={search} 
        setSearch={setSearch}
        />
            </div>

        </div>
        <CardGrid search={search} />
        </>
    );
}
export default Home;
