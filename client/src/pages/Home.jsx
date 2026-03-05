import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="page">
      <div className="hero">
        <p className="eyebrow">Trusted Dispatch in Nigeria</p>
        <h1>Move Your Cargo Faster from Lagos to Every State</h1>
        <p>
          We help businesses and individuals manage pickups, dispatch riders, haulage trips, and delivery tracking
          with dependable operations and clear communication.
        </p>
        <div className="cta-row">
          <Link to="/quote" className="btn btn-primary">Request Quote</Link>
          <button type="button" className="btn btn-secondary" disabled>
            Track Shipment (Coming Soon)
          </button>
        </div>
      </div>
    </section>
  )
}

export default Home
