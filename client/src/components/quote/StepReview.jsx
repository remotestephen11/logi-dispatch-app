function formatLabel(label) {
  return label
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatValue(key, value) {
  if (value === '' || value === undefined || value === null) {
    return 'Not provided'
  }

  if (key === 'company') {
    return value || 'Not provided'
  }

  if (key === 'weight_kg') {
    return `${value} kg`
  }

  if (key === 'value_amount') {
    return `NGN ${value}`
  }

  if (key === 'pickup_date') {
    return value
  }

  return String(value)
}

function StepReview({ values, attachmentName }) {
  const keys = [
    'full_name',
    'email',
    'phone',
    'company',
    'pickup_address',
    'delivery_address',
    'pickup_date',
    'vehicle_type',
    'service_level',
    'cargo_description',
    'weight_kg',
    'value_amount',
  ]

  return (
    <div className="quote-step">
      <h2>Step 3: Review</h2>
      <p>Confirm all details before submitting your quote request.</p>

      <dl className="review-grid">
        {keys.map((key) => (
          <div key={key} className="review-item">
            <dt>{formatLabel(key)}</dt>
            <dd>{formatValue(key, values[key])}</dd>
          </div>
        ))}
        <div className="review-item">
          <dt>Attachment</dt>
          <dd>{attachmentName || 'Not provided'}</dd>
        </div>
      </dl>
    </div>
  )
}

export default StepReview
