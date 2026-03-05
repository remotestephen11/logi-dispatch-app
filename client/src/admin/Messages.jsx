import { useEffect, useState } from 'react'
import { fetchMessages, updateMessageStatus } from '../api/admin'

const statuses = ['new', 'in_progress', 'closed']

function Messages() {
  const [messages, setMessages] = useState([])
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

    const loadMessages = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchMessages()
        if (isMounted) {
          setMessages(data)
        }
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

  const handleStatusChange = async (id, status) => {
    const previous = messages
    setMessages((items) => items.map((item) => (item.id === id ? { ...item, status } : item)))

    try {
      const updated = await updateMessageStatus(id, status)
      setMessages((items) => items.map((item) => (item.id === id ? updated : item)))
      setToast({ type: 'success', message: `Message #${id} status updated to ${status}.` })
    } catch (err) {
      setMessages(previous)
      const message = err.message || 'Failed to update message status'
      setError(message)
      setToast({ type: 'error', message })
    }
  }

  return (
    <section className="page">
      <h1>Messages</h1>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
      {loading && <p>Loading messages...</p>}
      {!loading && error && <p className="form-error">{error}</p>}
      {!loading && !error && messages.length === 0 && <p>No messages found.</p>}
      {!loading && !error && (
        messages.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id}>
                    <td>{message.id}</td>
                    <td>{message.full_name}</td>
                    <td>{message.email}</td>
                    <td>{message.subject}</td>
                    <td>
                      <select value={message.status} onChange={(e) => handleStatusChange(message.id, e.target.value)}>
                        {statuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>{message.created_at}</td>
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

export default Messages
