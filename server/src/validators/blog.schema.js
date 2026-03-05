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

const statusSchema = z.object({
  status: z.enum(['new', 'in_progress', 'closed']),
})

const blogCreateSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  slug: z.string().trim().min(3, 'Slug must be at least 3 characters'),
  excerpt: optionalString,
  content: z.string().trim().min(10, 'Content must be at least 10 characters'),
  published: z.coerce.number().int().min(0).max(1).default(0),
  cover_image_url: optionalString,
})

const blogUpdateSchema = blogCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'At least one field is required',
)

module.exports = {
  statusSchema,
  blogCreateSchema,
  blogUpdateSchema,
}
