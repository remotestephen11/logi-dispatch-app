const { z } = require('zod')

const optionalString = z.preprocess(
  (value) => {
    if (value === undefined || value === null) {
      return undefined
    }

    const normalized = String(value).trim()
    return normalized === '' ? undefined : normalized
  },
  z.string().optional(),
)

const optionalNumber = z.preprocess(
  (value) => {
    if (value === undefined || value === null || value === '') {
      return undefined
    }

    return value
  },
  z.coerce.number().optional(),
)

const quoteSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name is required'),
  email: z.string().trim().email('Email must be valid'),
  phone: z.string().trim().min(7, 'Phone is required'),
  company: optionalString,
  pickup_address: z.string().trim().min(1, 'Pickup address is required'),
  delivery_address: z.string().trim().min(1, 'Delivery address is required'),
  pickup_date: optionalString,
  vehicle_type: z.enum(['bike', 'van', 'truck']),
  service_level: z.enum(['standard', 'express']),
  cargo_description: z.string().trim().min(1, 'Cargo description is required'),
  weight_kg: optionalNumber,
  value_amount: optionalNumber,
  website: optionalString,
})

module.exports = { quoteSchema }
