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

function StepReview({ values, attachmentName, onEditContact, onEditShipment }) {
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Step 3: Review</h2>
          <p className="mt-1 text-slate-600">Confirm all details before submitting your quote request.</p>
        </div>
        <div className="flex gap-3 text-sm">
          <button type="button" onClick={onEditContact} className="font-semibold text-blue-700 hover:text-blue-800">Edit Contact</button>
          <button type="button" onClick={onEditShipment} className="font-semibold text-blue-700 hover:text-blue-800">Edit Shipment</button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <dl className="grid gap-3 sm:grid-cols-2">
          {keys.map((key) => (
            <div key={key} className="rounded-lg bg-white p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{formatLabel(key)}</dt>
              <dd className="mt-1 text-sm text-slate-700">{formatValue(key, values[key])}</dd>
            </div>
          ))}
          <div className="rounded-lg bg-white p-3 sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Attachment</dt>
            <dd className="mt-1 text-sm text-slate-700">{attachmentName || 'Not provided'}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default StepReview
