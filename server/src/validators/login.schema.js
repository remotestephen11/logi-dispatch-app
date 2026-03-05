const { z } = require('zod')

const loginSchema = z.object({
  email: z.string().trim().email('Email must be valid'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

module.exports = { loginSchema }
