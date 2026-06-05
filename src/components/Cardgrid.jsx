import { useEffect, useState } from 'react';
import Card from './Card';

function Cardgrid ({ search = '' }) {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('');

    
    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await fetch(
                    "https://db.ygoprodeck.com/api/v7/cardinfo.php?num=20&offset=0"
                );
            if (!response.ok) {
                throw new Error('Failed to fetch cards');
            }
            const data = await response.json();
        
            setCards(data.data);
            } catch (err) {
                setError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    const filteredCards = cards.filter((card) =>
        card.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <p>Loading cards...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const sortedCards = [...filteredCards].sort((a, b) => {
        if (sortOrder === 'az'){
            return a.name.localeCompare(b.name);
        }    
    
        if (sortOrder === 'za'){
            return b.name.localeCompare(a.name);
        }

        if (sortOrder === 'atkHigh') {
            return (b.atk ?? -1) - (a.atk ?? -1);
        }

        if (sortOrder === 'atkLow') {
            return (a.atk ?? 99999 ) - (b.atk ?? 99999);
        }

        return 0;
    });

    return (
        <>
        <select 
        value={sortOrder}
        onChange={(event) => setSortOrder(event.target.value)}>
            <option value="">Sort by</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
            <option value="atkHigh">Atk High-Low</option>
            <option value="atkLow">Atk Low-High</option>
        </select>

        <div className="card-grid">
            {sortedCards.map((card) => (
                <Card key={card.id} card={card} />
            ))}
        </div>
        </>
    );}

    export default Cardgrid;
