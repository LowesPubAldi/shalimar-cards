const highlights = [
  {
    title: 'Why I built it',
    text: 'Shalimar Cards started as a class prototype and became a way to practice turning a rough concept into something more usable, more polished, and easier to explain in a portfolio.',
  },
  {
    title: 'What I improved',
    text: 'I focused on the full browse flow: URL-backed search state, catalog filters, pagination, cached detail views, better loading states, and clearer error handling.',
  },
  {
    title: 'What powers it',
    text: 'The app is built with React and React Router, with live card data coming from the YGOProDeck API and tested user flows around the main routes.',
  },
];

function About () {
    return ( 
    <div className="page-content about-page">
    <section className="about-hero">
      <p className="eyebrow">Yu-Gi-Oh! database prototype</p>
      <h1>About Shalimar Cards</h1>
      <p className="page-lead">
        Shalimar Cards is a focused Yu-Gi-Oh! browser built to show clean front-end state handling, practical React routing, and a visible step up from an early prototype.
      </p>
    </section>

<div className="info-grid">
  {highlights.map((item) => (
    <section key={item.title} className="info-card">
      <h2>{item.title}</h2>
      <p>{item.text}</p>
    </section>
  ))}
</div>

<section className="about-notes">
  <h2>What this version proves</h2>
  <p>
    This build covers the core user path from start to finish: land on the home page, search for a card, move through the catalog with filters and pagination, and open a detail page without losing browse context.
  </p>
  <p>
    It is still intentionally lightweight, but it now reads like a deliberate product slice rather than a scaffold. If I kept extending it, the next steps would be richer filters, collection features, and a stronger deck-building workflow.
  </p>
  <p>
    For portfolio purposes, this project is meant to show more than styling alone. It reflects state management decisions, route-aware UX, API-driven rendering, and the ability to iterate on an early build until it feels intentional.
  </p>
</section>
</div>
);
}
export default About;
