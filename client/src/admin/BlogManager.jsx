import { useEffect, useState } from 'react'
import { createBlogPost, deleteBlogPost, fetchAdminBlog, updateBlogPost } from '../api/admin'

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  published: true,
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

function BlogManager() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    let isMounted = true

    const loadPosts = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchAdminBlog()

        if (isMounted) {
          setPosts(Array.isArray(data) ? data : [])
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

  useEffect(() => {
    if (!notice) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setNotice(null)
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [notice])

  const setField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  const startEdit = (post) => {
    setEditingId(post.id)
    setError('')
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      cover_image_url: post.cover_image_url || '',
      published: Number(post.published) === 1,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      cover_image_url: form.cover_image_url.trim(),
      published: form.published ? 1 : 0,
    }

    try {
      if (editingId) {
        const updated = await updateBlogPost(editingId, payload)
        setPosts((current) => current.map((post) => (post.id === editingId ? updated : post)))
        setNotice({ type: 'success', message: 'Blog post updated.' })
      } else {
        const created = await createBlogPost(payload)
        setPosts((current) => [created, ...current])
        setNotice({ type: 'success', message: 'Blog post created.' })
      }

      resetForm()
    } catch (err) {
      const message = err.message || 'Unable to save blog post'
      setError(message)
      setNotice({ type: 'error', message })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) {
      return
    }

    setError('')

    try {
      await deleteBlogPost(id)
      setPosts((current) => current.filter((post) => post.id !== id))
      setNotice({ type: 'success', message: 'Blog post deleted.' })

      if (editingId === id) {
        resetForm()
      }
    } catch (err) {
      const message = err.message || 'Failed to delete blog post'
      setError(message)
      setNotice({ type: 'error', message })
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Content</p>
          <h2>Blog Management</h2>
          <p className="admin-page-copy">Create and maintain published and draft posts from one screen.</p>
        </div>
      </div>

      {notice && <div className={`toast toast-${notice.type}`}>{notice.message}</div>}
      {error && <p className="form-error">{error}</p>}

      <div className="admin-section-grid">
        <section className="card">
          <div className="admin-section-heading">
            <div>
              <h3>{editingId ? 'Edit Post' : 'Create Post'}</h3>
              <p className="admin-section-copy">Use a clear title, stable slug, and publish only when ready.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field form-field-full">
                <label htmlFor="blog-title">Title</label>
                <input
                  id="blog-title"
                  value={form.title}
                  onChange={(event) => setField('title', event.target.value)}
                  required
                />
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="blog-slug">Slug</label>
                <input
                  id="blog-slug"
                  value={form.slug}
                  onChange={(event) => setField('slug', event.target.value)}
                  required
                />
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="blog-excerpt">Excerpt</label>
                <textarea
                  id="blog-excerpt"
                  rows="3"
                  value={form.excerpt}
                  onChange={(event) => setField('excerpt', event.target.value)}
                />
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="blog-cover-image">Cover Image URL</label>
                <input
                  id="blog-cover-image"
                  value={form.cover_image_url}
                  onChange={(event) => setField('cover_image_url', event.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="blog-content">Content</label>
                <textarea
                  id="blog-content"
                  rows="10"
                  value={form.content}
                  onChange={(event) => setField('content', event.target.value)}
                  required
                />
              </div>

              <div className="form-field form-field-full admin-checkbox-field">
                <label htmlFor="blog-published" className="admin-checkbox-label">
                  <input
                    id="blog-published"
                    type="checkbox"
                    checked={form.published}
                    onChange={(event) => setField('published', event.target.checked)}
                  />
                  Publish immediately
                </label>
              </div>
            </div>

            <div className="quote-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Post' : 'Create Post'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-muted" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card">
          <div className="admin-section-heading">
            <div>
              <h3>Posts</h3>
              <p className="admin-section-copy">Review all posts and jump into editing from the list.</p>
            </div>
          </div>

          {loading && <p>Loading blog posts...</p>}
          {!loading && posts.length === 0 && <p>No blog posts found.</p>}

          {!loading && posts.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Slug</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.title}</td>
                      <td>{Number(post.published) === 1 ? 'Published' : 'Draft'}</td>
                      <td>{post.slug}</td>
                      <td>{formatDate(post.created_at)}</td>
                      <td>
                        <div className="admin-inline-actions">
                          <button type="button" className="btn btn-muted" onClick={() => startEdit(post)}>
                            Edit
                          </button>
                          <button type="button" className="btn btn-danger" onClick={() => handleDelete(post.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

export default BlogManager
