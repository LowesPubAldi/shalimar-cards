import { Link, useLocation, useParams } from 'react-router-dom';
import useCardDetails from '../hooks/useCardDetails.js';

function CardDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { card, error, loading } = useCardDetails(id);
  const backTarget = location.state?.from ?? '/catalog';
  const backLabel = location.state?.fromLabel ?? 'Catalog';

  if (error) {
    return (
      <div className="card-details-page page-content">
        <div className="status-panel error-panel" role="alert">
          <h2>Card unavailable</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !card) {
    return (
      <div className="card-details-page page-content" aria-label="Loading card details">
        <div className="back-link skeleton-back-link shimmer-block" aria-hidden="true" />

        <div className="card-details card-details-skeleton">
          <div className="card-details-media">
            <div className="card-details-image-skeleton shimmer-block" aria-hidden="true" />
          </div>

          <div className="card-details-content">
            <div className="eyebrow skeleton-chip shimmer-block" aria-hidden="true" />
            <div className="detail-title-skeleton shimmer-block" aria-hidden="true" />
            <div className="detail-stat-grid">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="detail-stat-card" aria-hidden="true">
                  <div className="detail-stat-label-skeleton shimmer-block" />
                  <div className="detail-stat-value-skeleton shimmer-block" />
                </div>
              ))}
            </div>

            <section className="detail-section" aria-hidden="true">
              <div className="detail-section-title-skeleton shimmer-block" />
              <div className="detail-copy-skeleton shimmer-block" />
              <div className="detail-copy-skeleton shimmer-block" />
              <div className="detail-copy-skeleton short shimmer-block" />
            </section>
          </div>
        </div>
      </div>
    );
  }

  const cardSets = card.card_sets?.map((set) => set.set_name) ?? [];
  const cardStats = [
    { label: 'Type', value: card.type },
    { label: 'Race', value: card.race },
    { label: 'Level', value: card.level ?? 'N/A' },
    { label: 'Attribute', value: card.attribute || 'N/A' },
    { label: 'ATK', value: card.atk ?? 'N/A' },
    { label: 'DEF', value: card.def ?? 'N/A' },
    { label: 'Archetype', value: card.archetype ?? 'N/A' },
  ];

 return (
  <div className="card-details-page page-content">
    <Link to={backTarget} className="back-link">← Back to {backLabel}</Link>

    <div className="card-details">
      <div className="card-details-media">
        <img src={card.card_images[0].image_url} alt={card.name} />
      </div>

      <div className="card-details-content">
        <p className="eyebrow">Card profile</p>
        <h1>{card.name}</h1>
        <div className="detail-stat-grid">
          {cardStats.map((item) => (
            <div key={item.label} className="detail-stat-card">
              <span className="detail-stat-label">{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <section className="detail-section">
          <h2>Description</h2>
          <p>{card.desc}</p>
        </section>

        <section className="detail-section">
          <h2>Card Sets</h2>
          {cardSets.length > 0 ? (
            <ul className="detail-list">
              {cardSets.map((setName) => (
                <li key={setName}>{setName}</li>
              ))}
            </ul>
          ) : (
            <p>N/A</p>
          )}
        </section>
      </div>
    </div>
  </div>
  );
}

export default CardDetails;