import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { API_BASE_URL } from '../api/http'

const contactSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
  website: z.string().optional(),
})

const defaultValues = {
  full_name: '',
  email: '',
  subject: '',
  message: '',
  website: '',
}

function Contact() {
  const [toast, setToast] = useState(null)
  const [submitState, setSubmitState] = useState('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues,
    mode: 'onTouched',
  })

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timer = setTimeout(() => {
      setToast(null)
    }, 4000)

    return () => clearTimeout(timer)
  }, [toast])

  const onSubmit = async (values) => {
    setSubmitState('idle')

    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          website: '',
        }),
      })

      const payload = await response.json()

      if (!response.ok || !payload.ok) {
        const message = payload?.error?.message || 'Failed to send your message.'
        throw new Error(message)
      }

      setToast({ type: 'success', message: 'Message sent successfully. We will get back to you soon.' })
      setSubmitState('success')
      reset(defaultValues)
    } catch (error) {
      setSubmitState('error')
      setToast({
        type: 'error',
        message: error.message || 'Unable to send message right now. Please try again.',
      })
    }
  }

  return (
    <section className="space-y-8 py-12 sm:py-16">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Contact Operations Desk</h1>
        <p className="mt-2 text-slate-600">Reach our team for dispatch support, onboarding, and route planning.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Contact Information</h2>
            <p className="mt-2 text-slate-600">Lagos Operations HQ</p>
            <p className="text-slate-600">+234 800 000 0000</p>
            <p className="text-slate-600">support@logidispatch.local</p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Operating Cities</h3>
            <ul className="mt-2 space-y-1 text-slate-600">
              <li>• Lagos</li>
              <li>• Abuja</li>
              <li>• Port Harcourt</li>
              <li>• Ibadan</li>
              <li>• Kano</li>
            </ul>
          </div>
          <div className="h-32 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-500">
            Map placeholder
          </div>
        </article>

        <section className="quote-form-wrapper card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {toast && (
          <div className={`toast toast-${toast.type} mb-4`} role="status" aria-live="polite">
            {toast.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <input type="text" className="hp-field" tabIndex="-1" autoComplete="off" {...register('website')} />

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

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="subject">Subject</label>
              <input className="rounded-lg border border-slate-300 px-3 py-2" id="subject" type="text" {...register('subject')} />
              {errors.subject && <p className="form-error">{errors.subject.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="message">Message</label>
              <textarea className="rounded-lg border border-slate-300 px-3 py-2" id="message" rows="6" {...register('message')} />
              {errors.message && <p className="form-error">{errors.message.message}</p>}
            </div>
          </div>

          <div className="mt-5">
            <button type="submit" className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>

          {!isSubmitting && submitState === 'success' && (
            <p className="form-success">Your message has been submitted successfully.</p>
          )}

          {!isSubmitting && submitState === 'error' && (
            <p className="form-error">Your message could not be sent. Please try again.</p>
          )}
        </form>
      </section>
      </div>
    </section>
  )
}

export default Contact
