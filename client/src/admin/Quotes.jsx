import { useEffect, useState } from 'react'
import { fetchQuotes, updateQuoteStatus } from '../api/admin'

const statuses = ['pending', 'contacted', 'closed']

function formatDate(value) {
  if (!value) {
    return 'Recent'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

function Quotes() {
  const [quotes, setQuotes] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadQuotes = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchQuotes()

        if (!isMounted) {
          return
        }

        const nextQuotes = Array.isArray(data) ? data : []
        setQuotes(nextQuotes)
        setSelectedId((current) => current || nextQuotes[0]?.id || null)
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load quotes')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadQuotes()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!notice) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setNotice(null)
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [notice])

  const selectedQuote = quotes.find((quote) => quote.id === selectedId) || null

  const handleStatusChange = async (id, status) => {
    const previousQuotes = quotes
    setQuotes((current) => current.map((quote) => (quote.id === id ? { ...quote, status } : quote)))

    try {
      const updated = await updateQuoteStatus(id, status)
      setQuotes((current) => current.map((quote) => (quote.id === id ? updated : quote)))
      setNotice({ type: 'success', message: `Quote #${id} moved to ${status}.` })
    } catch (err) {
      setQuotes(previousQuotes)
      const message = err.message || 'Failed to update quote status'
      setError(message)
      setNotice({ type: 'error', message })
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Operations</p>
          <h2>Quote Management</h2>
          <p className="admin-page-copy">Review submissions, inspect details, and keep the pipeline current.</p>
        </div>
      </div>

      {notice && <div className={`toast toast-${notice.type}`}>{notice.message}</div>}
      {error && <p className="form-error">{error}</p>}
      {loading && <p>Loading quotes...</p>}

      {!loading && !error && quotes.length === 0 && <p>No quotes found.</p>}

      {!loading && quotes.length > 0 && (
        <div className="admin-section-grid admin-section-grid-wide">
          <section className="card">
            <div className="admin-section-heading">
              <div>
                <h3>Submitted Quotes</h3>
                <p className="admin-section-copy">Select a quote to inspect the request details.</p>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className={quote.id === selectedId ? 'admin-row-selected' : ''}
                      onClick={() => setSelectedId(quote.id)}
                    >
                      <td>{quote.id}</td>
                      <td>{quote.full_name}</td>
                      <td>{quote.pickup_address} to {quote.delivery_address}</td>
                      <td>{quote.status}</td>
                      <td>{formatDate(quote.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card">
            <div className="admin-section-heading">
              <div>
                <h3>Quote Details</h3>
                <p className="admin-section-copy">Full contact and shipment context for the selected request.</p>
              </div>
            </div>

            {selectedQuote && (
              <div className="admin-detail-stack">
                <div className="form-field">
                  <label htmlFor="quote-status">Status</label>
                  <select
                    id="quote-status"
                    value={selectedQuote.status}
                    onChange={(event) => handleStatusChange(selectedQuote.id, event.target.value)}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <dl className="admin-detail-grid">
                  <div className="review-item">
                    <dt>Full Name</dt>
                    <dd>{selectedQuote.full_name || '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Email</dt>
                    <dd>{selectedQuote.email || '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Phone</dt>
                    <dd>{selectedQuote.phone || '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Company</dt>
                    <dd>{selectedQuote.company || '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Pickup Address</dt>
                    <dd>{selectedQuote.pickup_address || '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Delivery Address</dt>
                    <dd>{selectedQuote.delivery_address || '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Pickup Date</dt>
                    <dd>{selectedQuote.pickup_date || '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Vehicle Type</dt>
                    <dd>{selectedQuote.vehicle_type || '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Service Level</dt>
                    <dd>{selectedQuote.service_level || '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Cargo Description</dt>
                    <dd>{selectedQuote.cargo_description || '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Weight</dt>
                    <dd>{selectedQuote.weight_kg ?? '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Declared Value</dt>
                    <dd>{selectedQuote.value_amount ?? '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Attachment</dt>
                    <dd>{selectedQuote.attachment_path || 'No attachment'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Submitted</dt>
                    <dd>{formatDate(selectedQuote.created_at)}</dd>
                  </div>
                </dl>
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  )
}

export default Quotes
