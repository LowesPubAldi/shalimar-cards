import { useEffect, useState } from 'react';
import Card from './Card';

function Cardgrid ({ search = '' }) {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
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

    return (
        <div className="card-grid">
            {filteredCards.map((card) => (
                <Card key={card.id} card={card} />
            ))}
        </div>
    );}

    export default Cardgrid;
