function Card ({ card }) {
    return (
        <div className="card">
            <img src={card.card_images[0].image_url} alt={card.name} /> 
            <h3>{card.name}</h3>
            <p>{card.type}</p>
        </div>
    );
}

export default Card;