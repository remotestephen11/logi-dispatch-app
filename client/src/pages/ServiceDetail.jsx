import { useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import { Card, CardDescription, CardTitle } from '../components/ui/Card'

function ServiceDetail() {
  const { slug } = useParams()
  const serviceName = slug ? slug.replace(/-/g, ' ') : 'service'

  return (
    <section className="py-12 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Card>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            {serviceName.split(' ').map((s) => s[0]?.toUpperCase() + s.slice(1)).join(' ')}
          </h1>
          <p className="mt-3 text-slate-600">
            This service is structured for predictable execution, clear delivery windows, and transparent customer updates.
          </p>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-slate-600">
            <li>Route and delivery planning tuned for Nigerian traffic realities.</li>
            <li>Escalation-ready communication flow from pickup to handoff.</li>
            <li>Performance tracking aligned with service-level expectations.</li>
          </ul>
        </Card>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardTitle>Need This Service?</CardTitle>
          <CardDescription>Send your route and volume details to get a custom quote quickly.</CardDescription>
          <div className="mt-4">
            <Button to="/quote">Request a Quote</Button>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default ServiceDetail
