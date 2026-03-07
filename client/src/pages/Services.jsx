import { Link } from 'react-router-dom'
import { Card, CardDescription, CardTitle } from '../components/ui/Card'

const services = [
  { slug: 'last-mile-delivery', title: 'Last Mile Delivery', icon: 'LM', summary: 'Rider-based doorstep deliveries in major cities.' },
  { slug: 'haulage', title: 'Haulage', icon: 'HG', summary: 'Heavy-duty transport for bulk and palletized goods.' },
  { slug: 'same-day', title: 'Same Day Dispatch', icon: 'SD', summary: 'Urgent local deliveries completed within hours.' },
  { slug: 'interstate', title: 'Interstate Logistics', icon: 'IS', summary: 'Scheduled freight movement between Nigerian states.' },
  { slug: 'warehousing', title: 'Warehousing', icon: 'WH', summary: 'Short and long-term storage with inventory handling.' },
  { slug: 'procurement-runs', title: 'Procurement Runs', icon: 'PR', summary: 'Source and move supplies from key market hubs.' },
]

function Services() {
  return (
    <section className="space-y-6 py-12 sm:py-16">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Our Services</h1>
        <p className="mt-2 text-slate-600">Flexible logistics support for retail, manufacturing, distribution, and ecommerce operations.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.slug} className="transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">{service.icon}</span>
            <CardTitle className="mt-2">{service.title}</CardTitle>
            <CardDescription>{service.summary}</CardDescription>
            <Link className="mt-4 inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800" to={`/services/${service.slug}`}>
              View service details {'->'}
            </Link>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default Services
