import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAdminSummary } from '../api/admin'

const emptySummary = {
  totalBlogPosts: 0,
  totalQuotes: 0,
  pendingQuotes: 0,
}

const summaryCards = [
  { key: 'totalBlogPosts', label: 'Total Blog Posts' },
  { key: 'totalQuotes', label: 'Total Quotes' },
  { key: 'pendingQuotes', label: 'Pending Quotes' },
]

function Dashboard() {
  const [summary, setSummary] = useState(emptySummary)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadSummary = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchAdminSummary()

        if (isMounted) {
          setSummary({
            totalBlogPosts: data.totalBlogPosts || 0,
            totalQuotes: data.totalQuotes || 0,
            pendingQuotes: data.pendingQuotes || 0,
          })
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load admin summary')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadSummary()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Overview</p>
          <h2>Dashboard</h2>
          <p className="admin-page-copy">A quick read on publishing activity and incoming quote demand.</p>
        </div>
      </div>

      {loading && <p>Loading dashboard summary...</p>}
      {!loading && error && <p className="form-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="admin-summary-grid">
            {summaryCards.map((card) => (
              <article key={card.key} className="card admin-summary-card">
                <p className="admin-summary-label">{card.label}</p>
                <p className="admin-summary-value">{summary[card.key]}</p>
              </article>
            ))}
          </div>

          <div className="admin-shortcuts-grid">
            <Link className="card admin-shortcut-card" to="/admin/blog">
              <h3>Manage Blog</h3>
              <p>Create, review, and update blog posts.</p>
            </Link>
            <Link className="card admin-shortcut-card" to="/admin/quotes">
              <h3>Manage Quotes</h3>
              <p>Track submissions and move each request through the pipeline.</p>
            </Link>
          </div>
        </>
      )}
    </section>
  )
}

export default Dashboard
