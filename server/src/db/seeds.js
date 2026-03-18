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

  const blogColumns = await db.all('PRAGMA table_info(blog_posts)')
  const hasCoverImage = blogColumns.some((column) => column.name === 'cover_image_url')

  if (!hasCoverImage) {
    await db.run('ALTER TABLE blog_posts ADD COLUMN cover_image_url TEXT')
  }
}

async function ensureQuoteSchema() {
  const quoteColumns = await db.all('PRAGMA table_info(quotes)')
  const existingColumns = new Set(quoteColumns.map((column) => column.name))

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
    if (!existingColumns.has(column.name)) {
      await db.run(`ALTER TABLE quotes ADD COLUMN ${column.name} ${column.sqlType}`)
    }
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
      title: 'How Dispatch Teams Can Reduce Failed Deliveries Before Riders Leave the Hub',
      slug: 'reduce-failed-deliveries-before-riders-leave-hub',
      excerpt: 'A practical pre-dispatch checklist for businesses that want fewer address issues, call-backs, and returned orders.',
      content:
        'Failed deliveries often start before a rider leaves the hub. Incomplete addresses, weak phone confirmation, and unclear handoff instructions create avoidable friction.\n\nA stronger dispatch process starts with address verification, customer confirmation, and route batching that reflects actual delivery windows. Even small operational checks can reduce wasted trips and make delivery output more predictable.\n\nFor growing teams, this matters because failed drops affect both customer trust and route efficiency. A cleaner pre-dispatch process protects margins while improving the customer experience.',
      cover_image_url: 'https://images.unsplash.com/photo-1553413077-190dd305871c',
    },
    {
      title: 'What a Good Logistics Quote Workflow Should Capture From Day One',
      slug: 'what-good-logistics-quote-workflow-should-capture',
      excerpt: 'Why route details, cargo profile, urgency, and service level matter more than a basic contact form.',
      content:
        'A logistics quote is not just a lead form. It should capture enough operational context for the business to decide whether the request is viable and how it should be priced.\n\nAt minimum, the workflow should collect pickup and delivery details, expected service level, cargo type, and a clear point of contact. Without that context, follow-up becomes slower and the first customer response often feels generic.\n\nFor service businesses, a structured quote process is one of the fastest ways to improve professionalism without adding a large amount of technical complexity.',
      cover_image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d',
    },
    {
      title: 'Planning Interstate Logistics Without Overpromising Delivery Windows',
      slug: 'planning-interstate-logistics-without-overpromising',
      excerpt: 'A grounded look at how to communicate reliability across longer Nigerian routes without promising unrealistic timelines.',
      content:
        'Interstate movement needs stronger planning than a standard city dispatch. Distance, road conditions, loading delays, and customer readiness all influence how realistic a delivery window will be.\n\nThe best operators set expectations around milestones, not just final ETA promises. That means aligning departure timing, route checkpoints, and receiving windows before the load even starts moving.\n\nWhen businesses communicate this clearly, they sound more credible and reduce preventable customer frustration.',
      cover_image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d',
    },
    {
      title: 'Using Content to Build Trust for a Logistics or Dispatch Business',
      slug: 'using-content-to-build-trust-for-logistics-business',
      excerpt: 'How a simple blog can help service businesses explain process quality, delivery standards, and operational thinking.',
      content:
        'Most logistics businesses rely heavily on direct outreach, referrals, and social channels. That works, but it often leaves potential clients without enough context about how the business actually operates.\n\nClear content can help close that gap. A well-positioned blog gives the business a place to explain service standards, common delivery issues, and how it approaches route planning or client communication.\n\nThat kind of content does not replace operations quality, but it helps the public site feel more like a real business platform than a thin brochure.',
      cover_image_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
    },
  ]

  for (const post of samplePosts) {
    await db.run(
      `INSERT INTO blog_posts (title, slug, excerpt, content, published, cover_image_url)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [post.title, post.slug, post.excerpt, post.content, post.cover_image_url || null],
    )
  }

  console.log(`Seed completed: inserted ${samplePosts.length} blog_posts records.`)
}

async function seedQuotes() {
  await ensureQuoteSchema()

  const countRow = await db.get('SELECT COUNT(*) AS count FROM quotes')
  if (countRow.count > 0) {
    console.log('Seed skipped: quotes table already contains records.')
    return
  }

  const sampleQuotes = [
    {
      full_name: 'Amina Yusuf',
      email: 'amina.yusuf@northgatefoods.ng',
      phone: '+234 803 100 2201',
      company: 'NorthGate Foods',
      pickup_address: 'Plot 12, Industrial Avenue, Ilupeju, Lagos',
      delivery_address: 'Wuse Market Service Road, Abuja',
      pickup_date: '2026-03-22',
      vehicle_type: 'truck',
      service_level: 'standard',
      cargo_description: 'Packaged dry food inventory for interstate restock',
      weight_kg: 1800,
      value_amount: 14500000,
      status: 'pending',
    },
    {
      full_name: 'Tobi Adekoya',
      email: 'ops@swiftcarepharmacy.com',
      phone: '+234 809 222 1180',
      company: 'SwiftCare Pharmacy',
      pickup_address: 'Admiralty Way, Lekki Phase 1, Lagos',
      delivery_address: 'Yaba College Road, Yaba, Lagos',
      pickup_date: '2026-03-20',
      vehicle_type: 'bike',
      service_level: 'express',
      cargo_description: 'Urgent pharmacy replenishment for same-day dispatch',
      weight_kg: 18,
      value_amount: 420000,
      status: 'contacted',
    },
    {
      full_name: 'Chinelo Nwosu',
      email: 'chinelo@urbanlineinteriors.com',
      phone: '+234 816 440 1900',
      company: 'UrbanLine Interiors',
      pickup_address: 'Aba Road, Port Harcourt',
      delivery_address: 'Ring Road, Ibadan',
      pickup_date: '2026-03-24',
      vehicle_type: 'van',
      service_level: 'standard',
      cargo_description: 'Interior fittings and customer installation materials',
      weight_kg: 320,
      value_amount: 2800000,
      status: 'pending',
    },
    {
      full_name: 'Femi Oladipo',
      email: 'femi.oladipo@meritretail.co',
      phone: '+234 701 555 9081',
      company: 'Merit Retail',
      pickup_address: 'Oregun Distribution Hub, Ikeja, Lagos',
      delivery_address: 'Bodija, Ibadan',
      pickup_date: '2026-03-18',
      vehicle_type: 'van',
      service_level: 'express',
      cargo_description: 'Store transfer stock for retail branch replenishment',
      weight_kg: 240,
      value_amount: 1850000,
      status: 'closed',
    },
  ]

  for (const quote of sampleQuotes) {
    await db.run(
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
        quote.full_name,
        quote.email,
        quote.phone,
        quote.company,
        quote.pickup_address,
        quote.delivery_address,
        quote.cargo_description,
        null,
        quote.pickup_address,
        quote.delivery_address,
        quote.pickup_date,
        quote.vehicle_type,
        quote.service_level,
        quote.cargo_description,
        quote.weight_kg,
        quote.value_amount,
        null,
        quote.status,
      ],
    )
  }

  console.log(`Seed completed: inserted ${sampleQuotes.length} quote records.`)
}

async function runSeeds() {
  await seedBlogPosts()
  await seedQuotes()
}

runSeeds()
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
