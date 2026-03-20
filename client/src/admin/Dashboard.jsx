import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAdminBlog, fetchAdminSummary, fetchQuotes } from '../api/admin'

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

function normalizeStatus(status) {
  if (status === 'new') {
    return 'pending'
  }

  if (status === 'in_progress') {
    return 'contacted'
  }

  return status || 'pending'
}

function formatDate(value) {
  if (!value) {
    return 'Recent'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString()
}

function Dashboard() {
  const [summary, setSummary] = useState(emptySummary)
  const [recentBlogTitle, setRecentBlogTitle] = useState('No blog posts yet')
  const [recentQuoteLabel, setRecentQuoteLabel] = useState('No quotes yet')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadRecentActivity = async ({ useForSummary = false } = {}) => {
      const [blogResult, quoteResult] = await Promise.allSettled([
        fetchAdminBlog(),
        fetchQuotes(),
      ])

      const blogPosts = blogResult.status === 'fulfilled' && Array.isArray(blogResult.value)
        ? blogResult.value
        : []
      const quotes = quoteResult.status === 'fulfilled' && Array.isArray(quoteResult.value)
        ? quoteResult.value
        : []

      if (!isMounted) {
        return
      }

      if (useForSummary) {
        setSummary({
          totalBlogPosts: blogPosts.length,
          totalQuotes: quotes.length,
          pendingQuotes: quotes.filter((quote) => normalizeStatus(quote.status) === 'pending').length,
        })
      }

      setRecentBlogTitle(blogPosts[0]?.title || 'No blog posts yet')

      if (quotes[0]) {
        setRecentQuoteLabel(
          `#${quotes[0].id} | ${normalizeStatus(quotes[0].status)} | ${formatDate(quotes[0].created_at)}`,
        )
      } else {
        setRecentQuoteLabel('No quotes yet')
      }

      if (blogResult.status === 'rejected' && quoteResult.status === 'rejected') {
        const blogMessage = blogResult.reason?.message
        const quoteMessage = quoteResult.reason?.message
        setError(blogMessage || quoteMessage || 'Failed to load admin dashboard')
      }
    }

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

        await loadRecentActivity()
      } catch {
        await loadRecentActivity({ useForSummary: true })
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

      {loading && (
        <div className="admin-summary-grid">
          {summaryCards.map((card) => (
            <article key={card.key} className="card admin-summary-card admin-loading-card">
              <p className="admin-summary-label">{card.label}</p>
              <p className="admin-summary-value">...</p>
            </article>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="admin-alert admin-alert-error">
          <p>{error}</p>
        </div>
      )}

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
            <article className="card admin-shortcut-card">
              <h3>Latest Blog Post</h3>
              <p>{recentBlogTitle}</p>
            </article>
            <article className="card admin-shortcut-card">
              <h3>Latest Quote Activity</h3>
              <p>{recentQuoteLabel}</p>
            </article>
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
