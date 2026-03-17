const db = require('../config/db')

async function ensureBlogSchema() {
  await db.run(
    `CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_id INTEGER,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      cover_image_url TEXT,
      content TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  )

  const columns = await db.all('PRAGMA table_info(blog_posts)')

  const hasCoverImage = columns.some((column) => column.name === 'cover_image_url')
  if (!hasCoverImage) {
    await db.run('ALTER TABLE blog_posts ADD COLUMN cover_image_url TEXT')
  }
}

async function seedBlogPosts() {
  await ensureBlogSchema()

  const countRow = await db.get('SELECT COUNT(*) AS count FROM blog_posts')
  if (countRow.count > 0) {
    console.log('Seed skipped: blog_posts table already contains records.')
    return
  }

  const samplePosts = [
    {
      title: 'How to Handle Last-Mile Delivery Delays in Lagos Traffic',
      slug: 'last-mile-delivery-delays-lagos-traffic',
      excerpt: 'Operational tips for reducing delay impact during peak-hour congestion in Lagos.',
      content:
        'Lagos congestion can affect ETAs quickly. Build realistic route buffers, batch nearby orders, and keep customers updated at every milestone. Pair rider dispatch with live call-ahead confirmation to reduce failed drops.',
      cover_image_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
    },
    {
      title: 'Dispatch Rider Safety Checklist for Rainy Season Operations',
      slug: 'dispatch-rider-safety-rainy-season-operations',
      excerpt: 'Practical rider safety controls for wet roads and low visibility periods.',
      content:
        'Rainy season operations demand stricter rider checks. Enforce helmet and reflective gear use, set lower speed thresholds, and avoid overloaded bikes. Add weather-triggered route rules and emergency contact procedures.',
      cover_image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
    },
    {
      title: 'Setting Realistic Delivery SLA Across Nigerian Cities',
      slug: 'setting-realistic-delivery-sla-nigerian-cities',
      excerpt: 'How to define service windows your operations team can consistently achieve.',
      content:
        'SLA design should reflect distance bands, pickup windows, and city-specific road conditions. Define clear exceptions for weather, security incidents, and access restrictions. Track on-time rates weekly and adjust thresholds with real data.',
      cover_image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    },
    {
      title: 'Interstate Haulage Planning Between Lagos, Abuja, and Port Harcourt',
      slug: 'interstate-haulage-planning-lagos-abuja-port-harcourt',
      excerpt: 'Route planning and scheduling fundamentals for high-volume interstate movement.',
      content:
        'Interstate haulage requires stronger pre-trip planning. Confirm loading readiness, road advisories, and delivery slot windows before departure. Use checkpoint updates and fallback route plans to protect schedule reliability.',
      cover_image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d',
    },
    {
      title: 'Reducing Failed Deliveries for Ecommerce Dispatch Teams',
      slug: 'reducing-failed-deliveries-ecommerce-dispatch-teams',
      excerpt: 'Address verification and recipient confirmation workflows that reduce returns.',
      content:
        'Failed deliveries are often avoidable with better data quality. Standardize address capture, send confirmation prompts before dispatch, and enable rider escalation if recipient details are unclear. Review failure reasons daily.',
      cover_image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d',
    },
    {
      title: 'Warehouse-to-Customer Handover Process That Scales',
      slug: 'warehouse-to-customer-handover-process-that-scales',
      excerpt: 'A repeatable handover flow from pick-pack to final customer confirmation.',
      content:
        'Scalable handover starts with strict order readiness gates. Validate SKU count, package condition, and dispatch labels before rider collection. Capture proof-of-pickup and proof-of-delivery events for a reliable audit trail.',
      cover_image_url: 'https://images.unsplash.com/photo-1553413077-190dd305871c',
    },
  ]

  for (const post of samplePosts) {
    await db.run(
      `INSERT INTO blog_posts (title, slug, excerpt, content, published, cover_image_url)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [post.title, post.slug, post.excerpt, post.content, post.cover_image_url || null],
    )
  }

  console.log('Seed completed: inserted 6 blog_posts records.')
}

seedBlogPosts()
  .then(() => db.close())
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error('Seeding failed:', err.message)
    try {
      await db.close()
    } catch (closeErr) {
      console.error('Failed to close database:', closeErr.message)
    }
    process.exit(1)
  })
