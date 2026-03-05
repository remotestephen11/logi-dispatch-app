import { Link } from 'react-router-dom'

const services = [
  { slug: 'last-mile-delivery', title: 'Last Mile Delivery', summary: 'Rider-based doorstep deliveries in major cities.' },
  { slug: 'haulage', title: 'Haulage', summary: 'Heavy-duty transport for bulk and palletized goods.' },
  { slug: 'same-day', title: 'Same Day Dispatch', summary: 'Urgent local deliveries completed within hours.' },
  { slug: 'interstate', title: 'Interstate Logistics', summary: 'Scheduled freight movement between Nigerian states.' },
  { slug: 'warehousing', title: 'Warehousing', summary: 'Short and long-term storage with inventory handling.' },
  { slug: 'procurement-runs', title: 'Procurement Runs', summary: 'Source and move supplies from key market hubs.' },
]

function Services() {
  return (
    <section className="page">
      <h1>Services</h1>
      <p>Flexible logistics support for retail, manufacturing, distribution, and ecommerce operations.</p>
      <div className="card-grid">
        {services.map((service) => (
          <article key={service.slug} className="card">
            <h2>{service.title}</h2>
            <p>{service.summary}</p>
            <p><strong>Slug:</strong> {service.slug}</p>
            <Link to={`/services/${service.slug}`}>View service details</Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Services
