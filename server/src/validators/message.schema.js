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

const messageSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Email must be valid'),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
  website: optionalString,
})

module.exports = { messageSchema }
