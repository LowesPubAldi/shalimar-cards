import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FeaturedCard from '../components/FeaturedCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CardGrid from '../components/Cardgrid.jsx';
import useCards from '../hooks/useCards.js';

const DESKTOP_BREAKPOINT = 1024;
const DESKTOP_PAGE_SIZE = 60;
const DEFAULT_PAGE_SIZE = 40;

function getHomePageSize() {
    if (typeof window === 'undefined') {
        return DEFAULT_PAGE_SIZE;
    }

    return window.innerWidth >= DESKTOP_BREAKPOINT ? DESKTOP_PAGE_SIZE : DEFAULT_PAGE_SIZE;
}

function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') ?? '';
    const [pageSize, setPageSize] = useState(getHomePageSize);
    const [sortOrder, setSortOrder] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [attributeFilter, setAttributeFilter] = useState('');
    const { cards, loading, error } = useCards({ pageSize });
    const typeOptions = Array.from(
        new Set(cards.map((card) => card.type).concat(typeFilter).filter(Boolean))
    ).sort((left, right) => left.localeCompare(right));
    const attributeOptions = Array.from(
        new Set(cards.map((card) => card.attribute).concat(attributeFilter).filter(Boolean))
    ).sort((left, right) => left.localeCompare(right));
    const heroStats = [
        { label: 'Search state', value: search ? 'URL synced' : 'Ready' },
        { label: 'Detail views', value: 'Session cached' },
        { label: 'Data source', value: loading ? 'Loading live API' : 'YGOProDeck API' },
    ];

    useEffect(() => {
        const handleResize = () => {
            setPageSize(getHomePageSize());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
                <div className="hero-inline-search">
                    <SearchBar
                        search={search}
                        setSearch={updateSearch}
                    />
                </div>
            </div>

            <div className="hero-secondary-grid">
                <div className="hero-featured-shell">
                    <FeaturedCard/>
                </div>
                <div className="hero-search-panel hero-sort-panel">
                    <h2>Sort and filter cards</h2>
                    <p>Change order or filter by type and attribute before browsing the first row.</p>
                    <div className="home-controls-grid">
                    <label className="filter-field home-filter-field">
                        <span>Sort</span>
                        <select
                            className="sort-select home-sort-select"
                            aria-label="Sort cards"
                            value={sortOrder}
                            onChange={(event) => setSortOrder(event.target.value)}
                        >
                            <option value="">Sort by</option>
                            <option value="az">A-Z</option>
                            <option value="za">Z-A</option>
                            <option value="atkHigh">Atk High-Low</option>
                            <option value="atkLow">Atk Low-High</option>
                        </select>
                    </label>
                    <label className="filter-field home-filter-field">
                        <span>Type</span>
                        <select
                            className="home-filter-select"
                            aria-label="Type filter"
                            value={typeFilter}
                            onChange={(event) => setTypeFilter(event.target.value)}
                        >
                            <option value="">All types</option>
                            {typeOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                    <label className="filter-field home-filter-field">
                        <span>Attribute</span>
                        <select
                            className="home-filter-select"
                            aria-label="Attribute filter"
                            value={attributeFilter}
                            onChange={(event) => setAttributeFilter(event.target.value)}
                        >
                            <option value="">All attributes</option>
                            {attributeOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                    </div>
                </div>
            </div>
        </div>
        <CardGrid
            cards={cards}
            loading={loading}
            error={error}
            search={search}
            typeFilter={typeFilter}
            attributeFilter={attributeFilter}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            hideSortControl
        />
        </>
    );
}
export default Home;
