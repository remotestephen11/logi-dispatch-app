import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { Card, CardDescription, CardTitle } from '../components/ui/Card'

const serviceHighlights = [
  { icon: 'LM', title: 'Last-Mile Delivery', copy: 'Doorstep deliveries powered by coordinated rider ops.' },
  { icon: 'WH', title: 'Warehousing', copy: 'Short and long-term storage with clean inventory handoffs.' },
  { icon: 'IS', title: 'Interstate Logistics', copy: 'Scheduled movement across major Nigerian routes.' },
  { icon: 'SD', title: 'Same-Day Dispatch', copy: 'Rapid fulfillment for urgent city-wide orders.' },
  { icon: 'HG', title: 'Haulage', copy: 'Bulk and palletized transport for heavy cargo requirements.' },
  { icon: 'PR', title: 'Procurement Runs', copy: 'Source and move business supplies from key market hubs.' },
]

function Home() {
  return (
    <div className="space-y-12 py-12 sm:space-y-16 sm:py-16">
      <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-8 text-white shadow-lg sm:p-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Trusted by modern operators</p>
        <h1 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
          Premium Dispatch Operations for Growing Teams Across Nigeria
        </h1>
        <p className="mt-4 max-w-2xl text-blue-100">
          From same-day city runs to interstate haulage coordination, LogiDispatch gives your team cleaner workflows,
          live updates, and dependable execution.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button to="/quote" variant="primary" size="hero">Request Quote</Button>
          <Button to="/services" variant="secondary" size="hero">View Services</Button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Trusted by operations teams</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm text-slate-600 sm:grid-cols-4">
          <span className="rounded-lg bg-slate-50 px-3 py-2">Lagos Retail Ops</span>
          <span className="rounded-lg bg-slate-50 px-3 py-2">NaijaEcom Hub</span>
          <span className="rounded-lg bg-slate-50 px-3 py-2">FleetBridge NG</span>
          <span className="rounded-lg bg-slate-50 px-3 py-2">SwiftMart Supply</span>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-3xl font-semibold text-slate-900">Services Built for Daily Reliability</h2>
          <p className="mt-2 text-slate-600">Structured logistics support that keeps your customer promises intact.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceHighlights.map((item) => (
            <Card key={item.title} className="transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">{item.icon}</span>
              <CardTitle className="mt-2">{item.title}</CardTitle>
              <CardDescription>{item.copy}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <div><p className="text-2xl font-semibold text-slate-900">98.2%</p><p className="text-sm text-slate-600">On-time delivery rate</p></div>
        <div><p className="text-2xl font-semibold text-slate-900">24/6</p><p className="text-sm text-slate-600">Operations coverage</p></div>
        <div><p className="text-2xl font-semibold text-slate-900">500+</p><p className="text-sm text-slate-600">Monthly dispatch runs</p></div>
        <div><p className="text-2xl font-semibold text-slate-900">40+</p><p className="text-sm text-slate-600">Cities served</p></div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-3xl font-semibold text-slate-900">What Clients Say</h2>
          <p className="mt-2 text-slate-600">Operational consistency that customers notice.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card><CardDescription>"Their route updates reduced our customer complaint volume in two weeks."</CardDescription><p className="mt-3 text-sm font-semibold text-slate-700">Operations Lead, Retail Brand</p></Card>
          <Card><CardDescription>"We scaled our interstate runs without losing shipment visibility."</CardDescription><p className="mt-3 text-sm font-semibold text-slate-700">Logistics Manager, Distributor</p></Card>
          <Card><CardDescription>"Dispatch handoff is cleaner, faster, and easier to track now."</CardDescription><p className="mt-3 text-sm font-semibold text-slate-700">Founder, Ecommerce Store</p></Card>
        </div>
      </section>

      <section className="rounded-3xl bg-slate-900 p-8 text-white sm:p-10">
        <h2 className="text-3xl font-semibold">Ready to tighten your logistics workflow?</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Share your delivery profile and we will send a practical quote tailored to your weekly volume and routes.
        </p>
        <div className="mt-6">
          <Button to="/quote">Get Your Quote</Button>
        </div>
      </section>
    </div>
  )
}

export default Home
