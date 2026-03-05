const express = require('express')
const db = require('../config/db')
const auth = require('../middleware/auth')
const { ok, fail } = require('../utils/responses')
const {
  statusSchema,
  blogCreateSchema,
  blogUpdateSchema,
} = require('../validators/blog.schema')

const router = express.Router()

async function ensureBlogColumns() {
  const columns = await db.all('PRAGMA table_info(blog_posts)')
  const existing = new Set(columns.map((column) => column.name))

  if (!existing.has('cover_image_url')) {
    await db.run('ALTER TABLE blog_posts ADD COLUMN cover_image_url TEXT')
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return fail(res, 'FORBIDDEN', 'Admin access required', 403)
  }

  next()
}

router.use(auth)
router.use(requireAdmin)

router.get('/quotes', async (req, res, next) => {
  try {
    const rows = await db.all(
      `SELECT *
       FROM quotes
       ORDER BY datetime(created_at) DESC, id DESC
       LIMIT 100`,
    )
    return ok(res, rows, { count: rows.length })
  } catch (err) {
    next(err)
  }
})

router.patch('/quotes/:id/status', async (req, res, next) => {
  try {
    const parsed = statusSchema.safeParse(req.body)
    if (!parsed.success) {
      return fail(res, 'VALIDATION_ERROR', 'Invalid status value', 400)
    }

    const quoteId = Number(req.params.id)
    if (!Number.isInteger(quoteId) || quoteId <= 0) {
      return fail(res, 'VALIDATION_ERROR', 'Invalid quote id', 400)
    }

    const result = await db.run('UPDATE quotes SET status = ? WHERE id = ?', [parsed.data.status, quoteId])
    if (result.changes === 0) {
      return fail(res, 'NOT_FOUND', 'Quote not found', 404)
    }

    const row = await db.get('SELECT * FROM quotes WHERE id = ?', [quoteId])
    return ok(res, row, {})
  } catch (err) {
    next(err)
  }
})

router.get('/messages', async (req, res, next) => {
  try {
    const rows = await db.all(
      `SELECT *
       FROM messages
       ORDER BY datetime(created_at) DESC, id DESC
       LIMIT 100`,
    )
    return ok(res, rows, { count: rows.length })
  } catch (err) {
    next(err)
  }
})

router.patch('/messages/:id/status', async (req, res, next) => {
  try {
    const parsed = statusSchema.safeParse(req.body)
    if (!parsed.success) {
      return fail(res, 'VALIDATION_ERROR', 'Invalid status value', 400)
    }

    const messageId = Number(req.params.id)
    if (!Number.isInteger(messageId) || messageId <= 0) {
      return fail(res, 'VALIDATION_ERROR', 'Invalid message id', 400)
    }

    const result = await db.run('UPDATE messages SET status = ? WHERE id = ?', [parsed.data.status, messageId])
    if (result.changes === 0) {
      return fail(res, 'NOT_FOUND', 'Message not found', 404)
    }

    const row = await db.get('SELECT * FROM messages WHERE id = ?', [messageId])
    return ok(res, row, {})
  } catch (err) {
    next(err)
  }
})

router.get('/blog', async (req, res, next) => {
  try {
    await ensureBlogColumns()
    const rows = await db.all(
      `SELECT id, title, slug, excerpt, content, published, cover_image_url, created_at
       FROM blog_posts
       ORDER BY datetime(created_at) DESC, id DESC`,
    )
    return ok(res, rows, { count: rows.length })
  } catch (err) {
    next(err)
  }
})

router.post('/blog', async (req, res, next) => {
  try {
    await ensureBlogColumns()
    const parsed = blogCreateSchema.safeParse(req.body)
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]
      return fail(res, 'VALIDATION_ERROR', firstIssue ? firstIssue.message : 'Invalid blog payload', 400)
    }

    const payload = parsed.data
    const insert = await db.run(
      `INSERT INTO blog_posts (title, slug, excerpt, content, published, cover_image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        payload.title,
        payload.slug,
        payload.excerpt || null,
        payload.content,
        payload.published,
        payload.cover_image_url || null,
      ],
    )

    const row = await db.get(
      `SELECT id, title, slug, excerpt, content, published, cover_image_url, created_at
       FROM blog_posts
       WHERE id = ?`,
      [insert.lastID],
    )
    return ok(res, row, {})
  } catch (err) {
    if (err && err.code === 'SQLITE_CONSTRAINT') {
      return fail(res, 'CONFLICT', 'Slug already exists', 409)
    }
    next(err)
  }
})

router.put('/blog/:id', async (req, res, next) => {
  try {
    await ensureBlogColumns()
    const parsed = blogUpdateSchema.safeParse(req.body)
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]
      return fail(res, 'VALIDATION_ERROR', firstIssue ? firstIssue.message : 'Invalid blog payload', 400)
    }

    const blogId = Number(req.params.id)
    if (!Number.isInteger(blogId) || blogId <= 0) {
      return fail(res, 'VALIDATION_ERROR', 'Invalid blog id', 400)
    }

    const current = await db.get('SELECT * FROM blog_posts WHERE id = ?', [blogId])
    if (!current) {
      return fail(res, 'NOT_FOUND', 'Blog post not found', 404)
    }

    const payload = parsed.data
    const nextValue = {
      title: payload.title !== undefined ? payload.title : current.title,
      slug: payload.slug !== undefined ? payload.slug : current.slug,
      excerpt: payload.excerpt !== undefined ? payload.excerpt : current.excerpt,
      content: payload.content !== undefined ? payload.content : current.content,
      published: payload.published !== undefined ? payload.published : current.published,
      cover_image_url:
        payload.cover_image_url !== undefined ? payload.cover_image_url : current.cover_image_url,
    }

    await db.run(
      `UPDATE blog_posts
       SET title = ?, slug = ?, excerpt = ?, content = ?, published = ?, cover_image_url = ?
       WHERE id = ?`,
      [
        nextValue.title,
        nextValue.slug,
        nextValue.excerpt || null,
        nextValue.content,
        nextValue.published,
        nextValue.cover_image_url || null,
        blogId,
      ],
    )

    const updated = await db.get(
      `SELECT id, title, slug, excerpt, content, published, cover_image_url, created_at
       FROM blog_posts
       WHERE id = ?`,
      [blogId],
    )

    return ok(res, updated, {})
  } catch (err) {
    if (err && err.code === 'SQLITE_CONSTRAINT') {
      return fail(res, 'CONFLICT', 'Slug already exists', 409)
    }
    next(err)
  }
})

router.delete('/blog/:id', async (req, res, next) => {
  try {
    const blogId = Number(req.params.id)
    if (!Number.isInteger(blogId) || blogId <= 0) {
      return fail(res, 'VALIDATION_ERROR', 'Invalid blog id', 400)
    }

    const result = await db.run('DELETE FROM blog_posts WHERE id = ?', [blogId])
    if (result.changes === 0) {
      return fail(res, 'NOT_FOUND', 'Blog post not found', 404)
    }

    return ok(res, { id: blogId, deleted: true }, {})
  } catch (err) {
    next(err)
  }
})

module.exports = router
