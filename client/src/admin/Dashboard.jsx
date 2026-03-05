import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchMessages, fetchQuotes } from '../api/admin'

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [kpi, setKpi] = useState({ totalQuotes: 0, newQuotes: 0, totalMessages: 0, newMessages: 0 })

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        setLoading(true)
        setError('')
        const [quotes, messages] = await Promise.all([fetchQuotes(), fetchMessages()])

        if (!isMounted) {
          return
        }

        setKpi({
          totalQuotes: quotes.length,
          newQuotes: quotes.filter((q) => q.status === 'new').length,
          totalMessages: messages.length,
          newMessages: messages.filter((m) => m.status === 'new').length,
        })
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load dashboard metrics')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="page">
      <h1>Admin Dashboard</h1>

      {loading && <p>Loading metrics...</p>}
      {!loading && error && <p className="form-error">{error}</p>}
      {!loading && !error && (
        <>
          <div className="card-grid">
            <article className="card"><h2>Total Quotes</h2><p>{kpi.totalQuotes}</p></article>
            <article className="card"><h2>New Quotes</h2><p>{kpi.newQuotes}</p></article>
            <article className="card"><h2>Total Messages</h2><p>{kpi.totalMessages}</p></article>
            <article className="card"><h2>New Messages</h2><p>{kpi.newMessages}</p></article>
          </div>

          <div className="card-grid">
            <Link className="card" to="/admin/quotes"><h2>Quotes</h2><p>Manage quote requests</p></Link>
            <Link className="card" to="/admin/messages"><h2>Messages</h2><p>Manage contact messages</p></Link>
            <Link className="card" to="/admin/blog"><h2>Blog</h2><p>Create and edit blog posts</p></Link>
          </div>
        </>
      )}
    </section>
  )
}

export default Dashboard
