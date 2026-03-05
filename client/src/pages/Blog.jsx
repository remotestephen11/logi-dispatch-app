import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../api/http'

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_BASE_URL}/api/blog`)
        const payload = await response.json()

        if (!response.ok || !payload.ok) {
          throw new Error(payload?.error?.message || 'Failed to load blog posts.')
        }

        if (isMounted) {
          setPosts(Array.isArray(payload.data) ? payload.data : [])
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load blog posts.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPosts()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="page">
      <h1>Blog</h1>
      <p>Practical logistics insights for dispatch teams operating in Nigeria.</p>
      {loading && <p>Loading posts...</p>}
      {!loading && error && <p className="form-error">{error}</p>}
      {!loading && !error && posts.length === 0 && <p>No published posts yet.</p>}
      {!loading && !error && posts.length > 0 && (
        <div className="card-grid">
          {posts.map((post) => (
            <article key={post.slug} className="card">
              <h2>{post.title}</h2>
              <p>{post.excerpt || 'No excerpt available yet.'}</p>
              <Link to={`/blog/${post.slug}`}>Read post</Link>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Blog
