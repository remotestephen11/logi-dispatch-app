function Card({ children, className = '' }) {
  return <article className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`.trim()}>{children}</article>
}

function CardTitle({ children, className = '' }) {
  return <h2 className={`text-xl font-semibold text-slate-900 ${className}`.trim()}>{children}</h2>
}

function CardDescription({ children, className = '' }) {
  return <p className={`mt-2 text-slate-600 ${className}`.trim()}>{children}</p>
}

export { Card, CardTitle, CardDescription }
