import Button from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const pricingTiers = [
  {
    name: 'Starter Operations',
    description: 'For smaller teams that need a dependable public presence and basic quote handling.',
    bullets: [
      'Best for early-stage logistics or dispatch businesses',
      'Suitable for lower recurring request volume',
      'Strong fit when the priority is cleaner client intake and presentation',
    ],
  },
  {
    name: 'Growth Operations',
    popular: true,
    description: 'For businesses that need a stronger workflow around incoming demand, service communication, and admin follow-up.',
    bullets: [
      'Best for growing dispatch or service operations',
      'Supports higher quote volume and stronger internal visibility',
      'Balanced option for teams moving beyond MVP-level process',
    ],
  },
  {
    name: 'Custom Operations',
    description: 'For businesses that need tailored workflows, wider service coverage, or future module expansion.',
    bullets: [
      'Best for more customized business operations',
      'Useful when service logic or approval flow differs by client',
      'Ideal when a business plans to evolve beyond the base workflow',
    ],
  },
]

function Pricing() {
  return (
    <section className="space-y-8 py-12 sm:py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">Commercial approach</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Operations are typically priced around route scope, service level, and delivery volume.</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          The tiers below are engagement guides for how a logistics business might package support. Final pricing is usually tailored to route frequency, shipment type, and response expectations.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.name}
            className={`relative ${tier.popular ? 'border-blue-200 shadow-lg ring-1 ring-blue-200' : ''}`}
          >
            {tier.popular && (
              <span className="absolute -top-3 right-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                Recommended
              </span>
            )}
            <h2 className="text-2xl font-semibold text-slate-900">{tier.name}</h2>
            <p className="mt-2 text-slate-600">{tier.description}</p>
            <ul className="mt-4 space-y-2 text-slate-600">
              {tier.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <span className="text-blue-600">+</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Button to="/quote" variant={tier.popular ? 'solid' : 'muted'} className="w-full">
                Discuss {tier.name}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default Pricing
