function StepShipment({ register, errors, attachmentFile, onAttachmentChange }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Step 2: Shipment Info</h2>
        <p className="mt-1 text-slate-600">Provide shipment details so we can estimate delivery timeline and cost.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="pickup_address">Pickup Address</label>
          <input className="rounded-lg border border-slate-300 px-3 py-2" id="pickup_address" type="text" {...register('pickup_address')} />
          {errors.pickup_address && <p className="form-error">{errors.pickup_address.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="delivery_address">Delivery Address</label>
          <input className="rounded-lg border border-slate-300 px-3 py-2" id="delivery_address" type="text" {...register('delivery_address')} />
          {errors.delivery_address && <p className="form-error">{errors.delivery_address.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="pickup_date">Pickup Date</label>
          <input className="rounded-lg border border-slate-300 px-3 py-2" id="pickup_date" type="date" {...register('pickup_date')} />
          {errors.pickup_date && <p className="form-error">{errors.pickup_date.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="vehicle_type">Vehicle Type</label>
          <select className="rounded-lg border border-slate-300 px-3 py-2" id="vehicle_type" defaultValue="" {...register('vehicle_type')}>
            <option value="" disabled>Select vehicle type</option>
            <option value="bike">Bike</option>
            <option value="van">Van</option>
            <option value="truck">Truck</option>
          </select>
          {errors.vehicle_type && <p className="form-error">{errors.vehicle_type.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="service_level">Service Level</label>
          <select className="rounded-lg border border-slate-300 px-3 py-2" id="service_level" defaultValue="" {...register('service_level')}>
            <option value="" disabled>Select service level</option>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
          </select>
          {errors.service_level && <p className="form-error">{errors.service_level.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="cargo_description">Cargo Description</label>
          <textarea className="rounded-lg border border-slate-300 px-3 py-2" id="cargo_description" rows="4" {...register('cargo_description')} />
          {errors.cargo_description && <p className="form-error">{errors.cargo_description.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="weight_kg">Weight (kg)</label>
          <input className="rounded-lg border border-slate-300 px-3 py-2" id="weight_kg" type="number" min="0" step="0.01" {...register('weight_kg')} />
          {errors.weight_kg && <p className="form-error">{errors.weight_kg.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="value_amount">Cargo Value (NGN)</label>
          <input className="rounded-lg border border-slate-300 px-3 py-2" id="value_amount" type="number" min="0" step="0.01" {...register('value_amount')} />
          {errors.value_amount && <p className="form-error">{errors.value_amount.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="attachment">Attachment (Optional)</label>
          <input className="rounded-lg border border-slate-300 px-3 py-2" id="attachment" type="file" onChange={onAttachmentChange} />
          {attachmentFile && <p className="form-note">Selected: {attachmentFile.name}</p>}
        </div>
      </div>
    </div>
  )
}

export default StepShipment
