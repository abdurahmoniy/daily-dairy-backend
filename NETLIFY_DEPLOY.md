# Netlify deploy

This backend runs on Netlify as an Express-backed Netlify Function.

## Netlify site settings

Use the `daily-dairy-backend` repository/folder as the Netlify base directory.

- Build command: `npm run build`
- Publish directory: `public`
- Functions directory: `netlify/functions`

These values are also defined in `netlify.toml`, so Netlify should pick them up automatically after the file is committed and pushed.

## Environment variables

Set these in Netlify: Site configuration -> Environment variables.

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=<your-production-secret>
```

For the current database credentials, build `DATABASE_URL` from the host, port, user, password, and database name provided outside this file. Do not commit real credentials.

## Database migration

Check migration status:

```bash
npx prisma migrate status
```

Apply migrations only after confirming the target database is correct and backed up:

```bash
npm run db:deploy
```

The current migration history includes schema changes that drop organization-related columns and the `Organization` table, so do not run this blindly against a database with important existing data.

## Verification

Before pushing:

```bash
npm run deploy:check
```

After deploy, open:

```text
https://<your-site>.netlify.app/
https://<your-site>.netlify.app/api/auth/login
```

The second URL should respond with a backend JSON error for unsupported GET requests, not a Netlify 404 page.
