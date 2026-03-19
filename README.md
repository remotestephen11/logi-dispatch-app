[README.md](https://github.com/user-attachments/files/26116424/README.md)
# Logi Dispatch App

Logi Dispatch App is a full-stack logistics operations platform built to showcase how a service business can combine public-facing credibility with practical internal workflow management. It includes a marketing site, a structured quote intake flow, a public blog, and a protected admin panel for dashboard visibility, quote management, and content control.

## Features

- Public-facing logistics website with service positioning, trust signals, and conversion-focused CTAs
- Multi-step quote request workflow with validation, business detail capture, and optional attachment upload
- Contact form with spam prevention and server-side validation
- Public blog experience backed by admin-controlled content management
- Protected admin login with token-based authentication
- Admin dashboard with headline business activity counts
- Quote pipeline management with status updates and detail review
- Blog CRUD for publishing and maintaining operational content
- Realistic demo seed data for portfolio screenshots and walkthroughs

## Tech Stack

### Frontend

- Vite
- React
- React Router
- Tailwind CSS
- React Hook Form
- Zod

### Backend

- Express
- SQLite
- JSON Web Tokens
- bcrypt
- multer
- express-rate-limit

### Deployment

- Vercel for the frontend
- Render for the backend

## Screenshots

Add screenshots here once captured:

- `homepage-screenshot.png`
- `admin-dashboard-screenshot.png`
- `blog-management-screenshot.png`
- `quote-management-screenshot.png`

## Live Demo

- Public app: `[Add public URL here]`
- API base URL: `[Add API URL here]`
- Admin login: `[Add admin login URL here]`

## Admin Access

For portfolio review, you can provide:

- A demo admin login URL
- Temporary demo credentials
- A short note explaining whether the environment is read-only or fully interactive

Do not commit production credentials to the repository.

## Why This Project Matters

This project is positioned as more than a simple logistics landing page. It demonstrates how a service business can:

- present itself credibly online
- collect structured operational requests from prospects
- manage inbound demand through a lightweight admin workflow
- control customer-facing content without a separate CMS

## Key Learning Outcomes

- Building a complete frontend and backend workflow around a business use case
- Designing a protected admin experience without overengineering the stack
- Structuring SQLite-backed CRUD flows for content and quote management
- Handling validation on both client and server
- Deploying a split frontend/backend product to Vercel and Render
- Turning an MVP into a more portfolio-ready and client-ready product

## Project Structure

```text
client/   Frontend application (Vite + React)
server/   Express API, SQLite database, migrations, seeds, and auth
```

## Environment Variables

### Client (`client/.env`)

- `VITE_API_URL=http://localhost:5000`

### Server (`server/.env`)

- `PORT=5000`
- `JWT_SECRET=your_secret_here`
- `CORS_ORIGIN=http://localhost:5173`
- `DB_PATH=optional/custom/path/to/app.sqlite`

Reference files:

- `client/.env.example`
- `server/.env.example`

## Local Setup

### 1. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Create environment files

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3. Run database migration and seed demo data

```bash
cd server
npm run db:migrate
npm run db:seed
npm run db:admin
```

### 4. Start the backend

```bash
cd server
npm run dev
```

### 5. Start the frontend

```bash
cd client
npm run dev
```

## Demo Admin Credentials

If you run the admin seed locally, the default credentials are:

- Email: `admin@logi.local`
- Password: `Admin123!`

Update these before using the project outside a local demo environment.

## Available Scripts

### Server

- `npm run start` - start the production server
- `npm run dev` - start the server with nodemon
- `npm run db:migrate` - apply database schema and compatibility updates
- `npm run db:seed` - seed realistic demo blog posts and quote requests
- `npm run db:admin` - create the admin user

### Client

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run preview` - preview the built frontend
- `npm run lint` - run frontend lint checks

## Deployment Notes

### Frontend on Vercel

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Required environment variable: `VITE_API_URL`

### Backend on Render

- Root directory: `server`
- Build command: `npm install && npm run db:migrate && npm run db:seed`
- Start command: `npm run start`
- Required environment variables: `PORT`, `JWT_SECRET`, `CORS_ORIGIN`
- Recommended: use a persistent disk or stable `DB_PATH` for SQLite in production

## Portfolio Positioning

This project can be presented as:

- a logistics dispatch platform
- a quote and content management system for service businesses
- a lightweight admin dashboard for operational follow-up
- a full-stack business workflow application built from MVP to client-ready presentation

## Future Expansion

Planned future directions can include PostgreSQL migration, richer content editing, pagination, analytics, role-based access control, and broader workflow automation. These are intentionally left out of the current implementation to keep the product lean and practical.
