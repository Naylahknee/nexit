import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { neon } from '@neondatabase/serverless'

const root = process.cwd()
for (const filename of ['.env.local', '.env']) {
  try {
    for (const line of readFileSync(resolve(root, filename), 'utf8').split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (!match || process.env[match[1]]) continue
      process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
    }
  } catch {}
}

if (!process.env.DATABASE_URL || !/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL)) {
  throw new Error('DATABASE_URL must be a valid Neon Postgres connection string')
}

const sql = neon(process.env.DATABASE_URL)
const directory = resolve(root, 'db', 'migrations')
for (const filename of readdirSync(directory).filter((name) => name.endsWith('.sql')).sort()) {
  await sql.query(readFileSync(resolve(directory, filename), 'utf8'))
  console.log(`Applied ${filename}`)
}
