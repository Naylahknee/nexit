# Nexit

A secure Next.js visa explorer backed by Neon Postgres. New email addresses create an account, returning users are authenticated with bcrypt, and protected country data requires a seven-day JWT.

## Setup

1. Create a Neon database and run [`db/schema.sql`](db/schema.sql) in its SQL editor.
2. Copy `.env.example` to `.env.local` and set a real `DATABASE_URL` and a random `JWT_SECRET` of at least 32 characters.
3. Install and start the app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run build
```

Visa recommendations are illustrative and are not legal advice. Confirm current eligibility rules with the relevant government authority.
