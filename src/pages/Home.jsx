import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FeaturedCard from '../components/FeaturedCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CardGrid from '../components/Cardgrid.jsx';
import useCards from '../hooks/useCards.js';

const DESKTOP_BREAKPOINT = 1024;
const TABLET_BREAKPOINT = 768;
const DESKTOP_PAGE_SIZE = 60;
const TABLET_PAGE_SIZE = 30;
const DEFAULT_PAGE_SIZE = 40;
const SORT_CYCLE = ['', 'az', 'za', 'atkHigh', 'atkLow'];
const SORT_BUTTON_LABELS = {
    '': 'Sort',
    az: 'Sort: A-Z',
    za: 'Sort: Z-A',
    atkHigh: 'Sort: ATK+',
    atkLow: 'Sort: ATK-',
};

function getHomePageSize() {
    if (typeof window === 'undefined') {
        return DEFAULT_PAGE_SIZE;
    }

    if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        return DESKTOP_PAGE_SIZE;
    }

    if (window.innerWidth >= TABLET_BREAKPOINT) {
        return TABLET_PAGE_SIZE;
    }

    return DEFAULT_PAGE_SIZE;
}

function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') ?? '';
    const [pageSize, setPageSize] = useState(getHomePageSize);
    const [sortOrder, setSortOrder] = useState('');
    const [tabletControlView, setTabletControlView] = useState('sort');
    const [typeFilter, setTypeFilter] = useState('');
    const [attributeFilter, setAttributeFilter] = useState('');
    const { cards, loading, error } = useCards({ pageSize, query: search });
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

    const cycleSortOrder = () => {
        const currentIndex = SORT_CYCLE.indexOf(sortOrder);
        const nextIndex = currentIndex === -1 ? 1 : (currentIndex + 1) % SORT_CYCLE.length;
        setSortOrder(SORT_CYCLE[nextIndex]);
        setTabletControlView('sort');
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
            </div>

            <div className="hero-secondary-grid">
                <div className="hero-featured-shell">
                    <FeaturedCard/>
                </div>
                <div className="hero-search-panel hero-sort-panel">
                    <h2>Sort and filter cards</h2>
                    <p>Change order or filter by type and attribute before browsing the first row.</p>

                    <div className="home-controls-switches" aria-label="Tablet control switches">
                        <button
                            type="button"
                            className={tabletControlView === 'sort' ? 'home-switch-button active' : 'home-switch-button'}
                            onClick={cycleSortOrder}
                        >
                            {SORT_BUTTON_LABELS[sortOrder] ?? 'Sort'}
                        </button>
                        <button
                            type="button"
                            className={tabletControlView === 'filter' ? 'home-switch-button active' : 'home-switch-button'}
                            onClick={() => setTabletControlView('filter')}
                        >
                            Filter
                        </button>
                        <button type="button" className="home-switch-button" disabled>Deck</button>
                        <button type="button" className="home-switch-button" disabled>Rarity</button>
                        <button type="button" className="home-switch-button" disabled>More</button>
                    </div>

                    <div className="home-controls-tablet-panel" aria-live="polite">
                        {tabletControlView === 'filter' ? (
                            <div className="home-filter-pair">
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
                        ) : null}
                    </div>

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

            <div className="hero-inline-search">
                <SearchBar
                    search={search}
                    setSearch={updateSearch}
                />
                <p className="hero-search-cta">
                    Prefer browsing? <Link to="/catalog">Use Catalog.</Link>
                </p>
            </div>
        </div>
        <p className="tablet-render-note" role="status">
            Tablet view renders fewer cards for smoother browsing. Use Search to jump to specific cards, or open on desktop to explore more cards at once.
        </p>
        <div className="home-card-grid-shell">
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
        </div>
        </>
    );
}
export default Home;
