import { Link } from 'react-router-dom'
import Container from './Container'
import { coverageCities } from '../content/siteContent'

function Footer() {
  return (
    <footer className="mt-14 border-t border-slate-800 bg-slate-900 text-slate-300">
      <Container className="grid gap-8 py-10 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-2 text-base font-semibold text-white">LogiDispatch</h3>
          <p>A logistics dispatch platform for service businesses that need stronger quote capture, clearer service positioning, and practical admin visibility.</p>
        </div>

        <div>
          <h3 className="mb-2 text-base font-semibold text-white">Navigation</h3>
          <ul className="space-y-1">
            <li><Link className="hover:text-white" to="/services">Services</Link></li>
            <li><Link className="hover:text-white" to="/pricing">Pricing</Link></li>
            <li><Link className="hover:text-white" to="/blog">Blog</Link></li>
            <li><Link className="hover:text-white" to="/quote">Request Quote</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-base font-semibold text-white">Coverage</h3>
          <p>{coverageCities.join(', ')}</p>
          <p className="mt-2">Operations Desk</p>
          <p>operations@logidispatch.app</p>
        </div>

        <div>
          <h3 className="mb-2 text-base font-semibold text-white">Platform</h3>
          <p>Public website, quote workflow, content publishing, and admin operations in one full-stack product.</p>
          <p className="mt-2">
            <Link className="text-xs text-slate-400 hover:text-white" to="/admin/login">Admin</Link>
          </p>
          <p className="mt-2 text-slate-400">Copyright {new Date().getFullYear()} LogiDispatch.</p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
