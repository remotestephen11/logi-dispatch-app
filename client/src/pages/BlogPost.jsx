import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_BASE_URL } from '../api/http'

function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchPost = async () => {
      if (!slug) {
        setError('Invalid blog post URL.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_BASE_URL}/api/blog/${slug}`)
        const payload = await response.json()

        if (!response.ok || !payload.ok) {
          throw new Error(payload?.error?.message || 'Failed to load blog post.')
        }

        if (isMounted) {
          setPost(payload.data || null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load blog post.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPost()

    return () => {
      isMounted = false
    }
  }, [slug])

  return (
    <section className="page">
      {loading && <p>Loading post...</p>}
      {!loading && error && <p className="form-error">{error}</p>}
      {!loading && !error && post && (
        <article className="card">
          <h1>{post.title}</h1>
          <p>{post.content}</p>
        </article>
      )}
    </section>
  )
}

export default BlogPost
