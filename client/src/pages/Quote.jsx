import QuoteForm from '../components/quote/QuoteForm'

function Quote() {
  return (
    <section className="space-y-8 py-12 sm:py-16">
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 p-8 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-100">Quote workflow</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Request a logistics quote with the details an operations team actually needs.</h1>
        <p className="mt-3 max-w-2xl text-blue-100">
          Share your contact details, route information, cargo profile, and service level so the business can review fit and respond with a practical proposal.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">What happens next</h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li>- Your request is captured with business and shipment context.</li>
            <li>- The admin team can review and update the quote pipeline internally.</li>
            <li>- A follow-up can be tailored to route needs, urgency, and service level.</li>
          </ul>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <QuoteForm />
        </div>
      </div>
    </section>
  )
}

export default Quote
