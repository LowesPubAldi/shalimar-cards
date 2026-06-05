import  { Link } from 'react-router-dom';

function Card ({ card }) {
    return (
        <Link to={`/card/${card.id}`}>
        <div className="card">
            <img src={card.card_images[0].image_url} alt={card.name} /> 
            <h3>{card.name}</h3>
            <p>{card.type}</p>
        </div>
        </Link>
    );
}

export default Card;