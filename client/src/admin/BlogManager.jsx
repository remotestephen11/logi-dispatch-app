import { useEffect, useState } from 'react'
import { createBlogPost, deleteBlogPost, fetchAdminBlog, updateBlogPost } from '../api/admin'

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  published: true,
}

function BlogManager() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

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

    const loadPosts = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchAdminBlog()
        if (isMounted) {
          setPosts(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load blog posts')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadPosts()

    return () => {
      isMounted = false
    }
  }, [])

  const onFormChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const startEdit = (post) => {
    setEditingId(post.id)
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      published: Number(post.published) === 1,
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const submitForm = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      published: form.published ? 1 : 0,
    }

    try {
      if (editingId) {
        const updated = await updateBlogPost(editingId, payload)
        setPosts((items) => items.map((item) => (item.id === editingId ? updated : item)))
        setToast({ type: 'success', message: 'Post updated.' })
      } else {
        const created = await createBlogPost(payload)
        setPosts((items) => [created, ...items])
        setToast({ type: 'success', message: 'Post created.' })
      }

      resetForm()
    } catch (err) {
      const message = err.message || 'Unable to save post'
      setError(message)
      setToast({ type: 'error', message })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this post?')
    if (!confirmed) {
      return
    }

    try {
      await deleteBlogPost(id)
      setPosts((items) => items.filter((item) => item.id !== id))
      setToast({ type: 'success', message: 'Post deleted.' })
      if (editingId === id) {
        resetForm()
      }
    } catch (err) {
      const message = err.message || 'Failed to delete post'
      setError(message)
      setToast({ type: 'error', message })
    }
  }

  return (
    <section className="page">
      <h1>Blog Manager</h1>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
      {loading && <p>Loading blog posts...</p>}
      {!loading && error && <p className="form-error">{error}</p>}

      {!loading && (
        <>
          <section className="card" style={{ marginBottom: '1rem' }}>
            <h2>{editingId ? 'Edit Post' : 'Create Post'}</h2>
            <form onSubmit={submitForm}>
              <div className="form-grid">
                <div className="form-field form-field-full">
                  <label htmlFor="blog-title">Title</label>
                  <input id="blog-title" value={form.title} onChange={(e) => onFormChange('title', e.target.value)} required />
                </div>

                <div className="form-field form-field-full">
                  <label htmlFor="blog-slug">Slug</label>
                  <input id="blog-slug" value={form.slug} onChange={(e) => onFormChange('slug', e.target.value)} required />
                </div>

                <div className="form-field form-field-full">
                  <label htmlFor="blog-excerpt">Excerpt</label>
                  <textarea id="blog-excerpt" rows="3" value={form.excerpt} onChange={(e) => onFormChange('excerpt', e.target.value)} />
                </div>

                <div className="form-field form-field-full">
                  <label htmlFor="blog-content">Content</label>
                  <textarea id="blog-content" rows="6" value={form.content} onChange={(e) => onFormChange('content', e.target.value)} required />
                </div>

                <div className="form-field form-field-full">
                  <label htmlFor="blog-published">
                    <input
                      id="blog-published"
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => onFormChange('published', e.target.checked)}
                    />{' '}
                    Published
                  </label>
                </div>
              </div>

              <div className="quote-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Post' : 'Create Post'}
                </button>
                {editingId && <button type="button" className="btn btn-muted" onClick={resetForm}>Cancel Edit</button>}
              </div>
            </form>
          </section>

          {!error && posts.length === 0 && <p>No blog posts found.</p>}
          {posts.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Published</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>{post.title}</td>
                      <td>{post.slug}</td>
                      <td>{Number(post.published) === 1 ? 'Yes' : 'No'}</td>
                      <td>{post.updated_at || post.created_at}</td>
                      <td>
                        <div className="quote-actions">
                          <button type="button" className="btn btn-muted" onClick={() => startEdit(post)}>Edit</button>
                          <button type="button" className="btn btn-secondary" onClick={() => handleDelete(post.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default BlogManager
