import { useEffect, useMemo, useState } from 'react'
import { fetchMessage, fetchMessages, updateMessageStatus } from '../api/admin'

const statuses = ['new', 'read', 'closed']

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

function previewText(value) {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim()
  if (!normalized) {
    return 'No message preview available.'
  }

  if (normalized.length <= 120) {
    return normalized
  }

  return `${normalized.slice(0, 117)}...`
}

function Messages() {
  const [messages, setMessages] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [statusUpdatingId, setStatusUpdatingId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadMessages = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchMessages()

        if (!isMounted) {
          return
        }

        const nextMessages = Array.isArray(data) ? data : []
        setMessages(nextMessages)
        setSelectedId((current) => current || nextMessages[0]?.id || null)
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load messages')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMessages()

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

  useEffect(() => {
    let isMounted = true

    const loadSelectedMessage = async () => {
      if (!selectedId) {
        setSelectedMessage(null)
        return
      }

      try {
        setDetailLoading(true)
        setError('')
        const data = await fetchMessage(selectedId)

        if (!isMounted) {
          return
        }

        setSelectedMessage(data || null)

        if (data?.status === 'new') {
          setStatusUpdatingId(selectedId)
          const updated = await updateMessageStatus(selectedId, 'read')

          if (!isMounted) {
            return
          }

          setSelectedMessage(updated)
          setMessages((current) => current.map((item) => (item.id === selectedId ? updated : item)))
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load message details')
        }
      } finally {
        if (isMounted) {
          setDetailLoading(false)
          setStatusUpdatingId(null)
        }
      }
    }

    loadSelectedMessage()

    return () => {
      isMounted = false
    }
  }, [selectedId])

  const selectedSummary = useMemo(
    () => messages.find((message) => message.id === selectedId) || null,
    [messages, selectedId],
  )

  const handleStatusChange = async (id, status) => {
    const previousMessages = messages
    const previousSelected = selectedMessage
    setError('')
    setStatusUpdatingId(id)
    setMessages((current) => current.map((item) => (item.id === id ? { ...item, status } : item)))
    setSelectedMessage((current) => (current && current.id === id ? { ...current, status } : current))

    try {
      const updated = await updateMessageStatus(id, status)
      setMessages((current) => current.map((item) => (item.id === id ? updated : item)))
      setSelectedMessage((current) => (current && current.id === id ? updated : current))
      setNotice({ type: 'success', message: `Message #${id} updated to ${status}.` })
    } catch (err) {
      setMessages(previousMessages)
      setSelectedMessage(previousSelected)
      const message = err.message || 'Failed to update message status'
      setError(message)
      setNotice({ type: 'error', message })
    } finally {
      setStatusUpdatingId(null)
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Inbox</p>
          <h2>Messages</h2>
          <p className="admin-page-copy">Review contact submissions and read the full message body from the admin panel.</p>
        </div>
      </div>

      {notice && <div className={`toast toast-${notice.type}`}>{notice.message}</div>}
      {error && (
        <div className="admin-alert admin-alert-error">
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="admin-feedback-state">
          <p className="admin-feedback-title">Loading messages...</p>
          <p className="admin-feedback-copy">Fetching contact submissions from the inbox.</p>
        </div>
      )}

      {!loading && !error && messages.length === 0 && (
        <div className="admin-feedback-state">
          <p className="admin-feedback-title">No messages yet</p>
          <p className="admin-feedback-copy">Contact form submissions will appear here as they come in.</p>
        </div>
      )}

      {!loading && messages.length > 0 && (
        <div className="admin-section-grid admin-section-grid-wide">
          <section className="card admin-panel-card">
            <div className="admin-section-heading">
              <div>
                <h3>Submitted Messages</h3>
                <p className="admin-section-copy">Select a message to read the full content and update its status.</p>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Preview</th>
                    <th>Status</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr
                      key={message.id}
                      className={message.id === selectedId ? 'admin-row-selected' : ''}
                      onClick={() => setSelectedId(message.id)}
                    >
                      <td>{message.full_name}</td>
                      <td>{message.email}</td>
                      <td>{message.subject || '-'}</td>
                      <td>{previewText(message.message)}</td>
                      <td>{message.status}</td>
                      <td>{formatDate(message.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card admin-panel-card">
            <div className="admin-section-heading">
              <div>
                <h3>Message Details</h3>
                <p className="admin-section-copy">Read the complete message and review sender information.</p>
              </div>
            </div>

            {detailLoading && (
              <div className="admin-feedback-state">
                <p className="admin-feedback-title">Loading message...</p>
                <p className="admin-feedback-copy">Fetching full message details.</p>
              </div>
            )}

            {!detailLoading && selectedSummary && (
              <div className="admin-detail-stack">
                <div className="form-field">
                  <label htmlFor="message-status">Status</label>
                  <select
                    id="message-status"
                    value={(selectedMessage || selectedSummary).status}
                    onChange={(event) => handleStatusChange((selectedMessage || selectedSummary).id, event.target.value)}
                    disabled={statusUpdatingId === (selectedMessage || selectedSummary).id}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {statusUpdatingId === (selectedMessage || selectedSummary).id && (
                    <p className="form-note">Updating message status...</p>
                  )}
                </div>

                <dl className="admin-detail-grid">
                  <div className="review-item">
                    <dt>Full Name</dt>
                    <dd>{(selectedMessage || selectedSummary).full_name || '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Email</dt>
                    <dd>{(selectedMessage || selectedSummary).email || '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Subject</dt>
                    <dd>{(selectedMessage || selectedSummary).subject || '-'}</dd>
                  </div>
                  <div className="review-item">
                    <dt>Submitted</dt>
                    <dd>{formatDate((selectedMessage || selectedSummary).created_at)}</dd>
                  </div>
                </dl>

                <div className="review-item">
                  <dt>Full Message</dt>
                  <dd className="whitespace-pre-wrap">{selectedMessage?.message || selectedSummary.message || '-'}</dd>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  )
}

export default Messages
