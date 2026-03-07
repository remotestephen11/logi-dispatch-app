import QuoteForm from '../components/quote/QuoteForm'

function Quote() {
  return (
    <section className="space-y-8 py-12 sm:py-16">
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
        <h1 className="text-3xl font-semibold sm:text-4xl">Request a Quote</h1>
        <p className="mt-3 max-w-2xl text-blue-100">
          Fill in your contact and shipment details. Our team will review and send a tailored logistics proposal.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <QuoteForm />
      </div>
    </section>
  )
}

export default Quote
