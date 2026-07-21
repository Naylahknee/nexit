# Nexit

A responsive relocation-planning app backed by Neon Postgres. It includes onboarding, a five-step visa wizard, country discovery, a move checklist, and a monthly cost calculator.

## Setup

1. Create a Neon database and run [`db/schema.sql`](db/schema.sql) in its SQL editor.
2. Copy `.env.example` to `.env.local` and set a real `DATABASE_URL` and a random `JWT_SECRET` of at least 32 characters.
3. Install and start the app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For an existing Nexit database, apply new migrations with `npm run db:migrate`.

## Checks

```bash
npm run lint
npm run build
```

Visa recommendations are illustrative and are not legal advice. Confirm current eligibility rules with the relevant government authority.

Country flags use free Unicode emoji, so no flag API key is required.
