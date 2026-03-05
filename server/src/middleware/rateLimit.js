const rateLimit = require('express-rate-limit')

const quoteRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many quote requests from this IP. Please try again later.',
    },
  },
})

module.exports = quoteRateLimit
