import { Navigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import { Card, CardDescription, CardTitle } from '../components/ui/Card'
import { serviceCatalog } from '../content/siteContent'

function ServiceDetail() {
  const { slug } = useParams()
  const service = serviceCatalog.find((item) => item.slug === slug)

  if (!service) {
    return <Navigate to="/services" replace />
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">Service detail</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">{service.title}</h1>
          <p className="mt-4 text-slate-600">{service.detail}</p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Best fit</p>
            <p className="mt-2 text-slate-700">{service.audience}</p>
          </div>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-slate-600">
            {service.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </Card>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardTitle>Need this service?</CardTitle>
          <CardDescription>Share your routes, shipment details, and service level needs to receive a practical quote.</CardDescription>
          <div className="mt-4">
            <Button to="/quote">Request a Quote</Button>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default ServiceDetail
