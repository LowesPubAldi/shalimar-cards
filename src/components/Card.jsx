function Card ({ card }) {
    return (
        <div>
            <h3>{card.name}</h3>
            <p>{card.game}</p>
        </div>
    );
}

export default Card;