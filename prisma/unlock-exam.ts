import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  console.log("Users in DB:", JSON.stringify(users, null, 2))
  
  const courses = await prisma.course.findMany()
  
  for (const user of users) {
    console.log(`🔓 Unlocking exam for user: ${user.email}`)
    
    for (const course of courses) {
      // Mark course as completed
      await prisma.courseProgress.upsert({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id
          }
        },
        create: {
          userId: user.id,
          courseId: course.id,
          completed: true
        },
        update: {
          completed: true
        }
      })
      
      // Also mark lessons as completed (to be thorough)
      const modules = await prisma.module.findMany({ where: { courseId: course.id } })
      for (const module of modules) {
        const lessons = await prisma.lesson.findMany({ where: { moduleId: module.id } })
        for (const lesson of lessons) {
          await prisma.progress.upsert({
            where: {
              userId_lessonId: {
                userId: user.id,
                lessonId: lesson.id
              }
            },
            create: {
              userId: user.id,
              lessonId: lesson.id,
              completed: true
            },
            update: {
              completed: true
            }
          })
        }
      }
    }
  }
  
  console.log("✅ All exams unlocked for all users.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
