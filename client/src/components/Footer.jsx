import { Link } from 'react-router-dom'
import Container from './Container'

function Footer() {
  return (
    <footer className="mt-14 border-t border-slate-800 bg-slate-900 text-slate-300">
      <Container className="grid gap-8 py-10 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-2 text-base font-semibold text-white">LogiDispatch</h3>
          <p>Reliable dispatch, haulage, and last-mile support for teams operating across Nigeria.</p>
        </div>

        <div>
          <h3 className="mb-2 text-base font-semibold text-white">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link className="hover:text-white" to="/services">Services</Link></li>
            <li><Link className="hover:text-white" to="/pricing">Pricing</Link></li>
            <li><Link className="hover:text-white" to="/blog">Blog</Link></li>
            <li><Link className="hover:text-white" to="/quote">Request Quote</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-base font-semibold text-white">Contact</h3>
          <p>Lagos Operations Desk</p>
          <p>support@logidispatch.local</p>
          <p>Mon - Sat, 8:00am - 6:00pm</p>
        </div>

        <div>
          <h3 className="mb-2 text-base font-semibold text-white">Company</h3>
          <p>Built for dependable shipment coordination and transparent customer updates.</p>
          <p className="mt-2 text-slate-400">Copyright {new Date().getFullYear()} LogiDispatch.</p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
