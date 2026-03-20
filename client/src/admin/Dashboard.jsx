import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAdminBlog, fetchAdminSummary, fetchMessageSummary, fetchMessages, fetchQuotes } from '../api/admin'

const emptySummary = {
  totalBlogPosts: 0,
  totalQuotes: 0,
  pendingQuotes: 0,
  totalMessages: 0,
  unreadMessages: 0,
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
  const [messageSummary, setMessageSummary] = useState({
    totalMessages: 0,
    unreadMessages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadRecentActivity = async ({ useForSummary = false, useForMessageSummary = false } = {}) => {
      const [blogResult, quoteResult, messageResult] = await Promise.allSettled([
        fetchAdminBlog(),
        fetchQuotes(),
        fetchMessages(),
      ])

      const blogPosts = blogResult.status === 'fulfilled' && Array.isArray(blogResult.value)
        ? blogResult.value
        : []
      const quotes = quoteResult.status === 'fulfilled' && Array.isArray(quoteResult.value)
        ? quoteResult.value
        : []
      const messages = messageResult.status === 'fulfilled' && Array.isArray(messageResult.value)
        ? messageResult.value
        : []

      if (!isMounted) {
        return
      }

      if (useForSummary) {
        setSummary({
          totalBlogPosts: blogPosts.length,
          totalQuotes: quotes.length,
          pendingQuotes: quotes.filter((quote) => normalizeStatus(quote.status) === 'pending').length,
          totalMessages: messages.length,
          unreadMessages: messages.filter((message) => message.status === 'new' || message.status === 'unread').length,
        })
      }

      if (useForMessageSummary) {
        setMessageSummary({
          totalMessages: messages.length,
          unreadMessages: messages.filter((message) => message.status === 'new' || message.status === 'unread').length,
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

      if (blogResult.status === 'rejected' && quoteResult.status === 'rejected' && messageResult.status === 'rejected') {
        const blogMessage = blogResult.reason?.message
        const quoteMessage = quoteResult.reason?.message
        const messageError = messageResult.reason?.message
        setError(blogMessage || quoteMessage || messageError || 'Failed to load admin dashboard')
      }
    }

    const loadSummary = async () => {
      try {
        setLoading(true)
        setError('')
        const [data, messageData] = await Promise.all([
          fetchAdminSummary(),
          fetchMessageSummary(),
        ])

        if (isMounted) {
          setSummary({
            totalBlogPosts: data.totalBlogPosts || 0,
            totalQuotes: data.totalQuotes || 0,
            pendingQuotes: data.pendingQuotes || 0,
            totalMessages: messageData.totalMessages || 0,
            unreadMessages: messageData.unreadMessages || 0,
          })
          setMessageSummary({
            totalMessages: messageData.totalMessages || 0,
            unreadMessages: messageData.unreadMessages || 0,
          })
        }

        await loadRecentActivity()
      } catch {
        await loadRecentActivity({ useForSummary: true, useForMessageSummary: true })
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
          {[...summaryCards, { key: 'messages', label: 'Messages' }].map((card) => (
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
            <Link
              className={`card admin-summary-card admin-summary-link ${messageSummary.unreadMessages > 0 ? 'admin-summary-card-attention' : ''}`}
              to="/admin/messages"
            >
              <div className="admin-summary-head">
                <p className="admin-summary-label">Messages</p>
                {messageSummary.unreadMessages > 0 && (
                  <span className="admin-summary-badge">{messageSummary.unreadMessages} unread</span>
                )}
              </div>
              <p className="admin-summary-value">{messageSummary.totalMessages}</p>
              <p className="admin-summary-copy">
                {messageSummary.unreadMessages > 0
                  ? `${messageSummary.unreadMessages} unread messages need review`
                  : 'No unread messages'}
              </p>
            </Link>
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
