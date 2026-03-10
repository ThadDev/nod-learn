# Nodlearn — Financial Education Platform

A production-ready full-stack Next.js 14 financial education platform.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: Prisma ORM + PostgreSQL (Neon)
- **Auth**: NextAuth.js v5 (Email magic links via Resend)
- **Email**: Resend API
- **Styling**: Tailwind CSS + Shadcn UI + Framer Motion
- **Validation**: Zod + React Hook Form

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local` and fill in the required values:

```env
DATABASE_URL="your-neon-postgres-connection-string"
NEXTAUTH_SECRET="run: openssl rand -hex 32"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="your-resend-key"
ADMIN_EMAIL="your-admin@email.com"
```

### 3. Migrate the database

```bash
npm run db:migrate
```

### 4. Seed the database (course content)

```bash
npm run db:seed
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Pages

| Route | Description |
|---|---|
| `/` | Home page |
| `/landing` | High-conversion landing page |
| `/course` | Course curriculum |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog article |
| `/about` | About page |
| `/faq` | FAQ |
| `/contact` | Contact |
| `/terms`, `/privacy`, `/disclaimer` | Legal pages |
| `/dashboard` | User dashboard (protected) |
| `/dashboard/course` | Course progress view (protected) |
| `/dashboard/lesson/[id]` | Lesson page (protected) |
| `/certificate/[id]` | Certificate view (protected) |
| `/admin` | Admin dashboard (admin only) |
| `/admin/blog/new` | Create blog post (admin only) |

## Admin Access

To make a user admin, update their `role` in the database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Set `NEXTAUTH_URL` to your Vercel deployment URL in production.
