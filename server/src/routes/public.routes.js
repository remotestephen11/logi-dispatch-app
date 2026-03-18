const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const express = require('express')
const multer = require('multer')
const db = require('../config/db')
const quoteRateLimit = require('../middleware/rateLimit')
const { quoteSchema } = require('../validators/quote.schema')
const { messageSchema } = require('../validators/message.schema')
const { ok, fail } = require('../utils/responses')

const router = express.Router()

const uploadsDir = path.resolve(__dirname, '..', 'uploads')
fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir)
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname)
    const unique = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`
    cb(null, `${unique}${ext}`)
  },
})

const upload = multer({ storage })

async function ensureQuoteColumns() {
  const columns = await db.all('PRAGMA table_info(quotes)')
  const existing = new Set(columns.map((column) => column.name))

  const requiredColumns = [
    { name: 'pickup_address', sqlType: 'TEXT' },
    { name: 'delivery_address', sqlType: 'TEXT' },
    { name: 'pickup_date', sqlType: 'TEXT' },
    { name: 'vehicle_type', sqlType: 'TEXT' },
    { name: 'service_level', sqlType: 'TEXT' },
    { name: 'cargo_description', sqlType: 'TEXT' },
    { name: 'weight_kg', sqlType: 'REAL' },
    { name: 'value_amount', sqlType: 'REAL' },
    { name: 'attachment_path', sqlType: 'TEXT' },
  ]

  for (const column of requiredColumns) {
    if (existing.has(column.name)) {
      continue
    }

    await db.run(`ALTER TABLE quotes ADD COLUMN ${column.name} ${column.sqlType}`)
  }
}

async function ensureBlogColumns() {
  const columns = await db.all('PRAGMA table_info(blog_posts)')
  const existing = new Set(columns.map((column) => column.name))

  if (!existing.has('cover_image_url')) {
    await db.run('ALTER TABLE blog_posts ADD COLUMN cover_image_url TEXT')
  }
}

router.get('/blog', async (req, res, next) => {
  try {
    await ensureBlogColumns()

    const posts = await db.all(
      `SELECT id, title, slug, excerpt, cover_image_url, created_at
       FROM blog_posts
       WHERE published = 1
       ORDER BY datetime(created_at) DESC, id DESC`,
    )

    return ok(res, posts, { count: posts.length })
  } catch (err) {
    next(err)
  }
})

router.get('/blog/:slug', async (req, res, next) => {
  try {
    await ensureBlogColumns()

    const post = await db.get(
      `SELECT id, title, slug, excerpt, cover_image_url, content, created_at
       FROM blog_posts
       WHERE slug = ? AND published = 1
       LIMIT 1`,
      [req.params.slug],
    )

    if (!post) {
      return fail(res, 'NOT_FOUND', 'Post not found', 404)
    }

    return ok(res, post, {})
  } catch (err) {
    next(err)
  }
})

router.post('/quotes', quoteRateLimit, upload.single('attachment'), async (req, res, next) => {
  try {
    if (req.body.website && String(req.body.website).trim() !== '') {
      return fail(res, 'SPAM_DETECTED', 'Invalid request payload.', 400)
    }

    const parsed = quoteSchema.safeParse(req.body)

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]
      return fail(res, 'VALIDATION_ERROR', firstIssue ? firstIssue.message : 'Invalid quote payload.', 400)
    }

    await ensureQuoteColumns()

    const payload = parsed.data
    const attachmentPath = req.file ? path.posix.join('uploads', req.file.filename) : null

    const insertResult = await db.run(
      `INSERT INTO quotes (
        full_name,
        email,
        phone,
        company,
        origin,
        destination,
        cargo_details,
        message,
        pickup_address,
        delivery_address,
        pickup_date,
        vehicle_type,
        service_level,
        cargo_description,
        weight_kg,
        value_amount,
        attachment_path,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.full_name,
        payload.email,
        payload.phone,
        payload.company || null,
        payload.pickup_address,
        payload.delivery_address,
        payload.cargo_description,
        null,
        payload.pickup_address,
        payload.delivery_address,
        payload.pickup_date || null,
        payload.vehicle_type,
        payload.service_level,
        payload.cargo_description,
        payload.weight_kg ?? null,
        payload.value_amount ?? null,
        attachmentPath,
        'pending',
      ],
    )

    const row = await db.get('SELECT id, status, created_at FROM quotes WHERE id = ?', [insertResult.lastID])

    return ok(
      res,
      {
        id: row.id,
        status: row.status,
        created_at: row.created_at,
      },
      {
        attachment_path: attachmentPath,
      },
    )
  } catch (err) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {})
    }

    next(err)
  }
})

router.post('/messages', quoteRateLimit, async (req, res, next) => {
  try {
    if (req.body.website && String(req.body.website).trim() !== '') {
      return fail(res, 'SPAM_DETECTED', 'Spam detected', 400)
    }

    const parsed = messageSchema.safeParse(req.body)

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]
      return fail(res, 'VALIDATION_ERROR', firstIssue ? firstIssue.message : 'Invalid message payload.', 400)
    }

    const payload = parsed.data

    const insertResult = await db.run(
      `INSERT INTO messages (
        full_name,
        email,
        subject,
        message,
        status
      ) VALUES (?, ?, ?, ?, ?)`,
      [payload.full_name, payload.email, payload.subject, payload.message, 'new'],
    )

    const row = await db.get('SELECT id, status, created_at FROM messages WHERE id = ?', [insertResult.lastID])

    return ok(
      res,
      {
        id: row.id,
        status: row.status,
        created_at: row.created_at,
      },
      {},
    )
  } catch (err) {
    next(err)
  }
})

module.exports = router
