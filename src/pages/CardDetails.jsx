import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function CardDetails() {
  const { id } = useParams();
  const [card, setCard] = useState(null);

  useEffect(() => {
    fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => setCard(data.data[0]))
      .catch((error) => console.error(error));
  }, [id]);

  if (!card) {
    return <h2>Loading card...</h2>;
  }

 return (
  <div>
    <Link to="/">← Back to Cards</Link>

    <div className="card-details">
      <img src={card.card_images[0].image_url} alt={card.name} />

      <div>
        <h1>{card.name}</h1>
        <p><strong>Type:</strong> {card.type}</p>
        <p><strong>Race:</strong> {card.race}</p>
        <p><strong>Level:</strong> {card.level ?? 'N/A'}</p>
        <p><strong>Archetype:</strong> {card.archetype ?? 'N/A'}</p>
        <p><strong>Attribute:</strong> {card.attribute || 'N/A'}</p>
        <p><strong>ATK:</strong> {card.atk ?? 'N/A'}</p>
        <p><strong>DEF:</strong> {card.def ?? 'N/A'}</p>
        <p><strong>Description:</strong> {card.desc}</p>
        <p><strong>Card Sets:</strong> {" "}
        {card.card_sets?.map(set => set.set_name).join(", ")}
        </p>
      </div>
    </div>
    </div>
  );
}

export default CardDetails;