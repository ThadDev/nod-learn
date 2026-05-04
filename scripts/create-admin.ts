import { config } from "dotenv"
config({ path: ".env.local" })

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    const email = "nodfinance@gmail.com"
    const password = "Admin@2026!" // change after first login

    const hashed = await bcrypt.hash(password, 12)

    const user = await prisma.user.upsert({
        where: { email },
        update: { role: "ADMIN", password: hashed, name: "Nodlearn Admin" },
        create: {
            email,
            name: "Nodlearn Admin",
            password: hashed,
            role: "ADMIN",
        },
    })

    console.log("✅  Admin user ready:", user.email, "| role:", user.role)
    console.log("🔑  Temporary password: Admin@2026!")
    console.log("⚠️   Change this password after first login.")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
