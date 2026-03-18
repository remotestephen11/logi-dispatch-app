import Button from '../components/ui/Button'
import { Card, CardDescription, CardTitle } from '../components/ui/Card'
import { businessSegments, processSteps, serviceCatalog, trustHighlights } from '../content/siteContent'

const featuredServices = serviceCatalog.slice(0, 3)

function Home() {
  return (
    <div className="space-y-12 py-12 sm:space-y-16 sm:py-16">
      <section className="grid gap-6 rounded-[2rem] border border-blue-100 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 p-8 text-white shadow-xl sm:p-12 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Logistics dispatch platform</p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">
            Dispatch operations, quote intake, and business visibility for service teams that need structure.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-blue-100 sm:text-lg">
            LogiDispatch helps logistics companies, dispatch teams, and service businesses manage inbound requests,
            communicate their services clearly, and keep operational follow-up organized from one workflow.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button to="/quote" variant="primary" size="hero">Request Quote</Button>
            <Button to="/services" variant="secondary" size="hero">Explore Services</Button>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-100">What this platform solves</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm font-semibold text-white">Scattered request handling</p>
              <p className="mt-1 text-sm text-blue-100">Capture quote requests with operational details instead of relying on vague WhatsApp threads or inbox messages.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm font-semibold text-white">Weak service communication</p>
              <p className="mt-1 text-sm text-blue-100">Use the public site and blog to explain services, reassure buyers, and support trust before contact.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm font-semibold text-white">Low admin visibility</p>
              <p className="mt-1 text-sm text-blue-100">Track incoming requests, update statuses, and manage content from one protected admin panel.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
        {trustHighlights.map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
            <p className="mt-1 text-sm text-slate-600">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">Who it is for</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Built for businesses that sell delivery, dispatch, or operational support.</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            The product is positioned for logistics operators that need a credible public presence and a simple internal workflow for following up on customer demand.
          </p>
        </div>

        <Card className="h-fit bg-slate-950 text-white shadow-lg">
          <CardTitle className="text-white">Typical fit</CardTitle>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {businessSegments.map((segment) => (
              <li key={segment} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {segment}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">Service coverage</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Structured logistics support across the core movement types businesses rely on.</h2>
          <p className="mt-2 max-w-3xl text-slate-600">
            From same-day city movement to interstate coordination and warehouse handoff support, the platform is designed to present logistics services as a serious business operation.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((item) => (
            <Card key={item.slug} className="transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                {item.icon}
              </span>
              <CardTitle className="mt-4">{item.title}</CardTitle>
              <CardDescription>{item.summary}</CardDescription>
              <p className="mt-4 text-sm text-slate-500">{item.audience}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">A clean flow from inbound demand to internal follow-up.</h2>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {processSteps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-blue-700">0{index + 1}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-slate-600">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-slate-900 p-8 text-white sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-200">Next step</p>
        <h2 className="mt-2 text-3xl font-semibold">Need a dispatch workflow that looks credible and works in practice?</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Request a quote with your routes, shipment profile, and service level needs. The workflow is built to capture enough context for a practical business response.
        </p>
        <div className="mt-6">
          <Button to="/quote">Start Quote Request</Button>
        </div>
      </section>
    </div>
  )
}

export default Home
