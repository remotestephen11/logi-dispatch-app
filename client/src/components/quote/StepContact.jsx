function StepContact({ register, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Step 1: Contact Info</h2>
        <p className="mt-1 text-slate-600">Tell us who to contact for this quote request.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="full_name">Full Name</label>
          <input className="rounded-lg border border-slate-300 px-3 py-2" id="full_name" type="text" {...register('full_name')} />
          {errors.full_name && <p className="form-error">{errors.full_name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email">Email</label>
          <input className="rounded-lg border border-slate-300 px-3 py-2" id="email" type="email" {...register('email')} />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone">Phone</label>
          <input className="rounded-lg border border-slate-300 px-3 py-2" id="phone" type="tel" {...register('phone')} />
          {errors.phone && <p className="form-error">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="company">Company (Optional)</label>
          <input className="rounded-lg border border-slate-300 px-3 py-2" id="company" type="text" {...register('company')} />
          {errors.company && <p className="form-error">{errors.company.message}</p>}
        </div>
      </div>
    </div>
  )
}

export default StepContact
