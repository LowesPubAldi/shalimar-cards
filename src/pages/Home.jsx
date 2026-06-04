import { useState } from 'react';
import FeaturedCard from '../components/FeaturedCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CardGrid from '../components/Cardgrid.jsx';

function Home() {
    const [search, setSearch] = useState('');

    return (
        <>
        <FeaturedCard />

        <SearchBar 
        search={search} 
        setSearch={setSearch}
        />

        <CardGrid search={search} />
        </>
    );
}

export default Home;
