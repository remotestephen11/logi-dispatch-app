# LogiDispatch App

LogiDispatch is a full-stack logistics and dispatch platform with a public website, quote and contact capture, blog publishing, and a protected admin dashboard.

## Features
- Public pages: Home, About, Services, Pricing, Blog, Contact, Quote
- Quote requests with multi-step form, validation, honeypot, rate limiting, and optional attachment upload
- Contact messages with server-side validation, honeypot protection, and rate limiting
- Blog powered by SQLite with public published-only endpoints
- Admin authentication with JWT
- Admin dashboard for quotes/messages status updates and blog CRUD

## Tech Stack
- Frontend: Vite, React, React Router, Tailwind CSS, React Hook Form, Zod
- Backend: Express, SQLite, Zod, JWT, bcrypt, multer, express-rate-limit

## Folder Structure
- `client/`: frontend app
- `server/`: API, SQLite database, migrations/seeds

## Environment Variables

### Client (`client/.env`)
- `VITE_API_URL` (example: `http://localhost:5000`)

### Server (`server/.env`)
- `PORT` (default: `5000`)
- `JWT_SECRET` (required for auth token signing)
- `CORS_ORIGIN` (allowed frontend origin, e.g. `http://localhost:5173`)
- `DB_PATH` (optional custom SQLite path; defaults to `server/src/db/app.sqlite`)

Reference files:
- `client/.env.example`
- `server/.env.example`

## Local Development Setup
1. Install dependencies:
```bash
cd server && npm install
cd ../client && npm install
```
2. Create env files from examples:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```
3. Initialize database and seed data:
```bash
cd server
npm run db:migrate
npm run db:seed
npm run db:admin
```
4. Run backend:
```bash
cd server
npm run dev
```
5. Run frontend:
```bash
cd client
npm run dev
```

## Admin Login (Local Dev)
- Create the dev admin with:
```bash
cd server
npm run db:admin
```
- Default seeded credentials:
  - Email: `admin@logi.local`
  - Password: `Admin123!`

## Package Scripts

### Server
- `npm run start` - production start
- `npm run dev` - nodemon development server
- `npm run db:migrate` - apply schema/migrations
- `npm run db:seed` - seed blog posts
- `npm run db:admin` - seed admin user

### Client
- `npm run dev` - Vite development server
- `npm run build` - production build
- `npm run preview` - preview build
- `npm run lint` - lint frontend code

## Deployment Notes

### Frontend (Vercel)
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Env var: `VITE_API_URL=https://your-render-api-url`

### Backend (Render)
- Root directory: `server`
- Build command: `npm install && npm run db:migrate && npm run db:seed`
- Start command: `npm run start`
- Configure env vars: `PORT`, `JWT_SECRET`, `CORS_ORIGIN`, `DB_PATH` (optional)
- Ensure a persistent disk/path is used for SQLite in production.
