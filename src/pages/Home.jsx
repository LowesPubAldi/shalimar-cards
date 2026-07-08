import { useSearchParams } from 'react-router-dom';
import FeaturedCard from '../components/FeaturedCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CardGrid from '../components/Cardgrid.jsx';
import useCards from '../hooks/useCards.js';

function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') ?? '';
    const { cards, loading, error } = useCards();
    const heroStats = [
        { label: 'Search state', value: search ? 'URL synced' : 'Ready' },
        { label: 'Detail views', value: 'Session cached' },
        { label: 'Data source', value: loading ? 'Loading live API' : 'YGOProDeck API' },
    ];

    const updateSearch = (value) => {
        const nextParams = new URLSearchParams(searchParams);

        if (value) {
            nextParams.set('search', value);
        } else {
            nextParams.delete('search');
        }

        setSearchParams(nextParams);
    };

    return ( 
        <>
        <div className="hero-section">
            <div className="hero-left">
                <p className="eyebrow">Searchable Yu-Gi-Oh! archive</p>
                <h1 className="hero-title">Shalimar Cards</h1>
                <p className="hero-copy">
                    A focused card browser for exploring Yu-Gi-Oh! data with fast search, richer catalog controls, and lightweight card detail views.
                </p>
                <div className="hero-stat-row">
                    {heroStats.map((item) => (
                        <div key={item.label} className="hero-stat-card">
                            <span>{item.label}</span>
                            <strong>{item.value}</strong>
                        </div>
                    ))}
                </div>
                <FeaturedCard/>
        </div>

        <div className="hero-search">
        <div className="hero-search-panel">
        <h2>Find a card quickly</h2>
        <p>Search by name, then refine the catalog with filters, sort order, and page controls.</p>
        <SearchBar
        search={search} 
        setSearch={updateSearch}
        />
        </div>
            </div>

        </div>
        <CardGrid cards={cards} loading={loading} error={error} search={search} />
        </>
    );
}
export default Home;
