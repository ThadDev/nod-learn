import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany()
    console.log("Current Users:")
    users.forEach(u => console.log(`- ${u.email} (Role: ${u.role})`))

    if (users.length > 0) {
        // Make the first user an admin for testing purposes
        const firstUser = users[0]
        if (firstUser.role !== 'ADMIN') {
            console.log(`\nPromoting ${firstUser.email} to ADMIN...`)
            await prisma.user.update({
                where: { id: firstUser.id },
                data: { role: 'ADMIN' }
            })
            console.log("Successfully promoted!")
        } else {
            console.log(`\n${firstUser.email} is already an ADMIN.`)
        }
    } else {
        console.log("No users found in the database. Please register an account first.")
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
