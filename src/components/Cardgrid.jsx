import cards from '../data/cards';
import Card from './Card';

function Cardgrid ({ search = '' }) {
    const filteredCards = cards.filter((card) =>
        card.name.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div>
            {filteredCards.map((card) => (
                <Card key={card.id} card={card} />
            ))}
        </div>
    );
}

export default Cardgrid;