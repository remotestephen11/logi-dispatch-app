import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../api/http'
import Button from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const popularTopics = ['Dispatch Safety', 'SLA Management', 'Fleet Efficiency', 'Last-Mile Optimization']

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
    <section className="space-y-8 py-12 sm:space-y-10 sm:py-16">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white sm:p-10">
        <h1 className="text-3xl font-semibold sm:text-4xl">Logistics Insights</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Practical dispatch playbooks, safety notes, and delivery strategy updates for operations teams.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div>
          {loading && <p>Loading posts...</p>}
          {!loading && error && <p className="form-error">{error}</p>}
          {!loading && !error && posts.length === 0 && <p>No published posts yet.</p>}
          {!loading && !error && posts.length > 0 && (
            <div className="grid gap-4">
              {posts.map((post) => (
                <Card key={post.slug} className="transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">Operations</span>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">{post.title}</h2>
                  <p className="mt-2 text-slate-600">{post.excerpt || 'No excerpt available yet.'}</p>
                  <Link className="mt-4 inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800" to={`/blog/${post.slug}`}>
                    Read post {'->'}
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900">Popular Topics</h3>
            <ul className="mt-3 space-y-2 text-slate-600">
              {popularTopics.map((topic) => (
                <li key={topic}>- {topic}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-slate-900">Need a logistics partner?</h3>
            <p className="mt-2 text-slate-600">Request a custom quote for your dispatch volume and routes.</p>
            <div className="mt-4">
              <Button to="/quote">Get a Quote</Button>
            </div>
          </Card>
        </aside>
      </div>
    </section>
  )
}

export default Blog
