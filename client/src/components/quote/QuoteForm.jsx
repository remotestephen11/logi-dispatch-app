import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import StepContact from './StepContact'
import StepShipment from './StepShipment'
import StepReview from './StepReview'
import { API_BASE_URL } from '../../api/http'
import Button from '../ui/Button'

const optionalPositiveNumber = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined
    }

    const parsed = Number(value)
    return Number.isNaN(parsed) ? value : parsed
  },
  z.number().positive('Must be greater than zero').optional(),
)

const quoteSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(1, 'Phone is required'),
  company: z.string().optional(),
  pickup_address: z.string().min(1, 'Pickup address is required'),
  delivery_address: z.string().min(1, 'Delivery address is required'),
  pickup_date: z.string().min(1, 'Pickup date is required'),
  vehicle_type: z.enum(['bike', 'van', 'truck'], {
    message: 'Vehicle type is required',
  }),
  service_level: z.enum(['standard', 'express'], {
    message: 'Service level is required',
  }),
  cargo_description: z.string().min(1, 'Cargo description is required'),
  weight_kg: optionalPositiveNumber,
  value_amount: optionalPositiveNumber,
  website: z.string().optional(),
})

const contactStepSchema = quoteSchema.pick({
  full_name: true,
  email: true,
  phone: true,
  company: true,
})

const shipmentStepSchema = quoteSchema.pick({
  pickup_address: true,
  delivery_address: true,
  pickup_date: true,
  vehicle_type: true,
  service_level: true,
  cargo_description: true,
  weight_kg: true,
  value_amount: true,
})

const stepFields = {
  1: ['full_name', 'email', 'phone', 'company'],
  2: [
    'pickup_address',
    'delivery_address',
    'pickup_date',
    'vehicle_type',
    'service_level',
    'cargo_description',
    'weight_kg',
    'value_amount',
  ],
}

const defaultValues = {
  full_name: '',
  email: '',
  phone: '',
  company: '',
  pickup_address: '',
  delivery_address: '',
  pickup_date: '',
  vehicle_type: '',
  service_level: '',
  cargo_description: '',
  weight_kg: '',
  value_amount: '',
  website: '',
}

function QuoteForm() {
  const [step, setStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attachmentFile, setAttachmentFile] = useState(null)
  const [toast, setToast] = useState(null)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues,
    mode: 'onTouched',
  })

  const values = watch()

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timer = setTimeout(() => {
      setToast(null)
    }, 4000)

    return () => clearTimeout(timer)
  }, [toast])

  const currentStepValid = useMemo(() => {
    if (step === 1) {
      return contactStepSchema.safeParse(values).success
    }

    if (step === 2) {
      return shipmentStepSchema.safeParse(values).success
    }

    return true
  }, [step, values])

  const nextStep = async () => {
    const isValid = await trigger(stepFields[step], { shouldFocus: true })
    if (isValid) {
      setStep((currentStep) => currentStep + 1)
    }
  }

  const previousStep = () => {
    setStep((currentStep) => Math.max(1, currentStep - 1))
  }

  const onSubmit = async (formValues) => {
    const formData = new FormData()

    Object.entries(formValues).forEach(([key, value]) => {
      if (key === 'website') {
        formData.append('website', '')
        return
      }

      if (value === undefined || value === null || value === '') {
        return
      }

      formData.append(key, String(value))
    })

    if (attachmentFile) {
      formData.append('attachment', attachmentFile)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/quotes`, {
        method: 'POST',
        body: formData,
      })

      const payload = await response.json()

      if (!response.ok || !payload.ok) {
        const message = payload?.error?.message || 'Failed to submit quote request.'
        throw new Error(message)
      }

      setToast({ type: 'success', message: 'Quote request submitted successfully.' })
      setIsSubmitted(true)
    } catch (error) {
      setToast({
        type: 'error',
        message: error.message || 'Unable to submit quote request. Please try again.',
      })
    }
  }

  const handleAttachmentChange = (event) => {
    const file = event.target.files?.[0] || null
    setAttachmentFile(file)
  }

  if (isSubmitted) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {toast && (
          <div className={`toast toast-${toast.type} mb-4`} role="status" aria-live="polite">
            {toast.message}
          </div>
        )}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Quote Request Submitted</h2>
          <p className="mt-2 text-slate-600">Thank you. Our team will review your details and contact you shortly.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {toast && (
        <div className={`toast toast-${toast.type} mb-4`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}

      <div className="mb-6" aria-label="Quote progress">
        <div className="flex items-center gap-3">
          {['Step 1', 'Step 2', 'Review'].map((label, index) => {
            const indexStep = index + 1
            const active = step >= indexStep
            return (
              <div key={label} className="flex flex-1 items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {indexStep}
                </div>
                <span className={`text-sm font-medium ${active ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
                {index < 2 && <div className={`h-1 flex-1 rounded ${step > indexStep ? 'bg-blue-500' : 'bg-slate-200'}`} />}
              </div>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <input type="text" className="hp-field" tabIndex="-1" autoComplete="off" {...register('website')} />
        {step === 1 && <StepContact register={register} errors={errors} />}
        {step === 2 && (
          <StepShipment
            register={register}
            errors={errors}
            attachmentFile={attachmentFile}
            onAttachmentChange={handleAttachmentChange}
          />
        )}
        {step === 3 && (
          <StepReview
            values={values}
            attachmentName={attachmentFile?.name}
            onEditContact={() => setStep(1)}
            onEditShipment={() => setStep(2)}
          />
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {step > 1 && (
            <Button type="button" variant="muted" onClick={previousStep}>Back</Button>
          )}

          {step < 3 && (
            <Button type="button" onClick={nextStep} disabled={!currentStepValid}>Next</Button>
          )}

          {step === 3 && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
            </Button>
          )}
        </div>
      </form>
    </section>
  )
}

export default QuoteForm
