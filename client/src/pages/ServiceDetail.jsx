import { useParams } from 'react-router-dom'

function ServiceDetail() {
  const { slug } = useParams()
  const serviceName = slug ? slug.replace(/-/g, ' ') : 'service'

  return (
    <section className="page">
      <h1>Service Detail</h1>
      <p>Details for: <strong>{serviceName}</strong>. Full service pages can be expanded with scope, SLA, and pricing data.</p>
    </section>
  )
}

export default ServiceDetail
