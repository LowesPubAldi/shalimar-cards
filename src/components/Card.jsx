import  { Link, useLocation } from 'react-router-dom';

function Card ({ card }) {
    const location = useLocation();
    const fromPath = `${location.pathname}${location.search}`;
    const fromLabel = location.pathname === '/catalog' ? 'Catalog' : 'Home';

    return (
        <Link
        to={`/card/${card.id}`}
        state={{ from: fromPath, fromLabel }}
        className="card-link">
        <div className="card">
            <img src={card.card_images[0].image_url} alt={card.name} /> 
            <h3>{card.name}</h3>
            <p>{card.type}</p>
        </div>
        </Link>
    );
}

export default Card;