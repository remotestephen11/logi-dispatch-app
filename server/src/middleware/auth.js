const jwt = require('jsonwebtoken')
const { fail } = require('../utils/responses')

function auth(req, res, next) {
  const header = req.headers.authorization || ''

  if (!header.startsWith('Bearer ')) {
    return fail(res, 'UNAUTHORIZED', 'Authentication required', 401)
  }

  const token = header.slice(7).trim()

  if (!token) {
    return fail(res, 'UNAUTHORIZED', 'Authentication required', 401)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return fail(res, 'UNAUTHORIZED', 'Invalid or expired token', 401)
  }
}

module.exports = auth
