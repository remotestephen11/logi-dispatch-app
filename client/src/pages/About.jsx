import { Card } from '../components/ui/Card'
import { businessSegments, processSteps } from '../content/siteContent'

function About() {
  return (
    <section className="space-y-8 py-12 sm:space-y-10 sm:py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">About the platform</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">LogiDispatch is built to present logistics operations as a real, organized business system.</h1>
        <p className="mt-4 max-w-3xl text-slate-600">
          The product combines a public-facing service site with an internal admin workflow for quote handling, content control, and basic pipeline visibility. It is designed for logistics operators and service companies that need something stronger than a simple brochure website but lighter than a complex enterprise platform.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="text-2xl font-semibold text-slate-900">What it is built to support</h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            {businessSegments.map((segment) => (
              <li key={segment} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                {segment}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="bg-slate-950 text-white">
          <h2 className="text-2xl font-semibold text-white">Core product principles</h2>
          <div className="mt-4 space-y-4 text-slate-300">
            <p>Clear service positioning so potential clients understand what the business does.</p>
            <p>Structured inbound requests so operations teams can respond with the right level of context.</p>
            <p>Practical admin control without unnecessary complexity or feature bloat.</p>
          </div>
        </Card>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">Workflow</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">A lightweight operating model for modern service businesses.</h2>
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
    </section>
  )
}

export default About
