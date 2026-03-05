const pricingTiers = [
  {
    name: 'Basic',
    description: 'Best for startups and low-volume weekly deliveries.',
    bullets: ['Up to 50 deliveries/month', 'Standard dispatch support (business hours)', 'Basic proof-of-delivery updates'],
  },
  {
    name: 'Business',
    description: 'For growing operations handling city-wide and interstate requests.',
    bullets: ['Up to 250 deliveries/month', 'Priority dispatch assignment', 'Weekly performance and SLA reporting'],
  },
  {
    name: 'Enterprise',
    description: 'For high-volume businesses needing dedicated logistics coordination.',
    bullets: ['Unlimited monthly dispatch volume', 'Dedicated account and operations manager', 'Custom routing, warehousing, and procurement support'],
  },
]

function Pricing() {
  return (
    <section className="page">
      <h1>Pricing</h1>
      <p>Choose a plan that matches your shipment volume and service-level needs.</p>
      <div className="card-grid">
        {pricingTiers.map((tier) => (
          <article key={tier.name} className="card">
            <h2>{tier.name}</h2>
            <p>{tier.description}</p>
            <ul>
              {tier.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Pricing
