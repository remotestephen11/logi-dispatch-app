import { Link } from 'react-router-dom'
import { Card, CardDescription, CardTitle } from '../components/ui/Card'
import { serviceCatalog } from '../content/siteContent'

function Services() {
  return (
    <section className="space-y-8 py-12 sm:space-y-10 sm:py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">Service catalog</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Services structured around real dispatch and logistics workflows.</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Each service line is presented as part of a serious operations business, with clearer audience fit, stronger positioning, and practical delivery context.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {serviceCatalog.map((service) => (
          <Card key={service.slug} className="flex h-full flex-col transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
              {service.icon}
            </span>
            <CardTitle className="mt-4">{service.title}</CardTitle>
            <CardDescription>{service.summary}</CardDescription>
            <p className="mt-4 text-sm text-slate-500">{service.audience}</p>
            <Link className="mt-5 inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800" to={`/services/${service.slug}`}>
              View service details {'->'}
            </Link>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default Services
