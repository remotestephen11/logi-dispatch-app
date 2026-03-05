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
    <section className="page">
      <h1>Contact</h1>
      <p>Speak with our Lagos operations desk for delivery support, onboarding, and dispatch scheduling.</p>

      <section className="quote-form-wrapper card">
        {toast && (
          <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
            {toast.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <input type="text" className="hp-field" tabIndex="-1" autoComplete="off" {...register('website')} />

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

            <div className="form-field form-field-full">
              <label htmlFor="subject">Subject</label>
              <input id="subject" type="text" {...register('subject')} />
              {errors.subject && <p className="form-error">{errors.subject.message}</p>}
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="6" {...register('message')} />
              {errors.message && <p className="form-error">{errors.message.message}</p>}
            </div>
          </div>

          <div className="quote-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
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
    </section>
  )
}

export default Contact
