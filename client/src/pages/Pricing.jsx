import Button from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const pricingTiers = [
  {
    name: 'Basic',
    description: 'Best for startups and low-volume weekly deliveries.',
    bullets: ['Up to 50 deliveries/month', 'Standard dispatch support (business hours)', 'Basic proof-of-delivery updates'],
  },
  {
    name: 'Business',
    popular: true,
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
    <section className="space-y-8 py-12 sm:py-16">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Pricing Plans</h1>
        <p className="mt-2 text-slate-600">Choose the service level that fits your route complexity and monthly volume.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.name}
            className={`relative ${tier.popular ? 'border-blue-200 shadow-lg ring-1 ring-blue-200' : ''}`}
          >
            {tier.popular && (
              <span className="absolute -top-3 right-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </span>
            )}
            <h2 className="text-2xl font-semibold text-slate-900">{tier.name}</h2>
            <p className="mt-2 text-slate-600">{tier.description}</p>
            <ul className="mt-4 space-y-2 text-slate-600">
              {tier.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <span className="text-green-600">+</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Button to="/quote" variant={tier.popular ? 'solid' : 'muted'} className="w-full">
                Select {tier.name}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default Pricing
