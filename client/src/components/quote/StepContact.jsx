function StepContact({ register, errors }) {
  return (
    <div className="quote-step">
      <h2>Step 1: Contact Info</h2>
      <p>Tell us who to contact for this quote request.</p>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="full_name">Full Name</label>
          <input id="full_name" type="text" {...register('full_name')} />
          {errors.full_name && <p className="form-error">{errors.full_name.message}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" type="tel" {...register('phone')} />
          {errors.phone && <p className="form-error">{errors.phone.message}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="company">Company (Optional)</label>
          <input id="company" type="text" {...register('company')} />
          {errors.company && <p className="form-error">{errors.company.message}</p>}
        </div>
      </div>
    </div>
  )
}

export default StepContact
