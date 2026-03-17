const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../config/db')
const { loginSchema } = require('../validators/login.schema')
const { ok, fail } = require('../utils/responses')

const router = express.Router()

router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body)

    if (!parsed.success) {
      return fail(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401)
    }

    const { email, password } = parsed.data
    console.log(`[auth] login attempt email=${email}`)

    const user = await db.get(
      'SELECT id, email, role, password_hash FROM users WHERE email = ? LIMIT 1',
      [email],
    )

    console.log(`[auth] user found=${Boolean(user)} email=${email}`)

    if (!user) {
      return fail(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401)
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)
    console.log(`[auth] password matched=${passwordMatches} email=${email}`)

    if (!passwordMatches) {
      return fail(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401)
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    )

    return ok(
      res,
      {
        token,
        user: {
          email: user.email,
          role: user.role,
        },
      },
      {},
    )
  } catch (err) {
    next(err)
  }
})

module.exports = router
