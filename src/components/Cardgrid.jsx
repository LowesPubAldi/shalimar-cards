import { useState } from 'react';
import Card from './Card';

const LOADING_CARD_COUNT = 8;

function Cardgrid ({
    cards = [],
    loading = false,
    error = '',
    search = '',
    typeFilter = '',
    attributeFilter = '',
    sortOrder,
    onSortChange,
    hideSortControl = false,
}) {
    const [internalSortOrder, setInternalSortOrder] = useState('');

    const activeSortOrder = sortOrder ?? internalSortOrder;

    const handleSortChange = (value) => {
        if (onSortChange) {
            onSortChange(value);
            return;
        }

        setInternalSortOrder(value);
    };

    
    const filteredCards = cards.filter((card) =>
        card.name.toLowerCase().includes(search.toLowerCase()) &&
        (!typeFilter || card.type === typeFilter) &&
        (!attributeFilter || card.attribute === attributeFilter)
    );

    if (loading) {
        return (
            <>
            {!hideSortControl ? <div className="sort-select skeleton-select" aria-hidden="true" /> : null}
            <div className="card-grid" aria-label="Loading cards">
                {Array.from({ length: LOADING_CARD_COUNT }, (_, index) => (
                    <div key={index} className="card card-skeleton" aria-hidden="true">
                        <div className="card-skeleton-image shimmer-block" />
                        <div className="card-skeleton-line shimmer-block" />
                        <div className="card-skeleton-line short shimmer-block" />
                    </div>
                ))}
            </div>
            </>
        );
    }

    if (error) {
        return (
            <div className="status-panel error-panel" role="alert">
                <h2>Catalog unavailable</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (filteredCards.length === 0) {
        return <p className="empty-state">No cards matched that search. Try a different name.</p>;
    }

    const sortedCards = [...filteredCards].sort((a, b) => {
        if (activeSortOrder === 'az'){
            return a.name.localeCompare(b.name);
        }    
    
        if (activeSortOrder === 'za'){
            return b.name.localeCompare(a.name);
        }

        if (activeSortOrder === 'atkHigh') {
            return (b.atk ?? -1) - (a.atk ?? -1);
        }

        if (activeSortOrder === 'atkLow') {
            return (a.atk ?? 99999 ) - (b.atk ?? 99999);
        }

        return 0;
    });

    return (
        <>
        {!hideSortControl ? (
            <select className="sort-select"
            aria-label="Sort cards"
            value={activeSortOrder}
            onChange={(event) => handleSortChange(event.target.value)}>
                <option value="">Sort by</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
                <option value="atkHigh">Atk High-Low</option>
                <option value="atkLow">Atk Low-High</option>
            </select>
        ) : null}

        <div className="card-grid">
            {sortedCards.map((card) => (
                <Card key={card.id} card={card} />
            ))}
        </div>
        </>
    );}

    export default Cardgrid;
