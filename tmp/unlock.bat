@echo off
set "DATABASE_URL=postgresql://neondb_owner:npg_Ph1UiOSZcW0b@ep-gentle-sun-a4jk5hji-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
npx tsx prisma/unlock-exam.ts
