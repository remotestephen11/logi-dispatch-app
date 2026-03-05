import { useEffect, useState } from 'react'
import { fetchQuotes, updateQuoteStatus } from '../api/admin'

const statuses = ['new', 'in_progress', 'closed']

function Quotes() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timer = setTimeout(() => {
      setToast(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    let isMounted = true

    const loadQuotes = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchQuotes()
        if (isMounted) {
          setQuotes(data)
        }
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

  const handleStatusChange = async (id, status) => {
    const previous = quotes
    setQuotes((items) => items.map((item) => (item.id === id ? { ...item, status } : item)))

    try {
      const updated = await updateQuoteStatus(id, status)
      setQuotes((items) => items.map((item) => (item.id === id ? updated : item)))
      setToast({ type: 'success', message: `Quote #${id} status updated to ${status}.` })
    } catch (err) {
      setQuotes(previous)
      const message = err.message || 'Failed to update quote status'
      setError(message)
      setToast({ type: 'error', message })
    }
  }

  return (
    <section className="page">
      <h1>Quotes</h1>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
      {loading && <p>Loading quotes...</p>}
      {!loading && error && <p className="form-error">{error}</p>}
      {!loading && !error && quotes.length === 0 && <p>No quotes found.</p>}
      {!loading && !error && (
        quotes.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Pickup</th>
                  <th>Delivery</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr key={quote.id}>
                    <td>{quote.id}</td>
                    <td>{quote.full_name}</td>
                    <td>{quote.pickup_address}</td>
                    <td>{quote.delivery_address}</td>
                    <td>{quote.vehicle_type}</td>
                    <td>
                      <select value={quote.status} onChange={(e) => handleStatusChange(quote.id, e.target.value)}>
                        {statuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>{quote.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </section>
  )
}

export default Quotes
