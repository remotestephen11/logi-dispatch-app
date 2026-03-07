import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { API_BASE_URL } from '../api/http'
import Button from '../components/ui/Button'
import { Card } from '../components/ui/Card'

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
    <section className="py-12 sm:py-16">
      {loading && <p>Loading post...</p>}
      {!loading && error && <p className="form-error">{error}</p>}
      {!loading && !error && post && (
        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <article className="max-w-prose rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Link to="/blog" className="text-sm font-semibold text-blue-700 hover:text-blue-800">{'<'} Back to Blog</Link>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">{post.title}</h1>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
              <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recent'}</span>
              <span>|</span>
              <span>5 min read</span>
            </div>
            {post.excerpt && <p className="mt-4 text-slate-600">{post.excerpt}</p>}
            <p className="mt-5 whitespace-pre-wrap text-slate-700">{post.content}</p>
          </article>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card>
              <h3 className="text-lg font-semibold text-slate-900">Need support with similar operations?</h3>
              <p className="mt-2 text-slate-600">Let us tailor a dispatch plan for your routes and delivery windows.</p>
              <div className="mt-4">
                <Button to="/quote">Request Quote</Button>
              </div>
            </Card>
          </aside>
        </div>
      )}
    </section>
  )
}

export default BlogPost
