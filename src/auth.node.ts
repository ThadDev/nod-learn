import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"

// Extend session types
declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name?: string | null
            email?: string | null
            image?: string | null
            role: "USER" | "ADMIN"
        }
    }
    interface User {
        role?: "USER" | "ADMIN"
    }
}


const config: NextAuthConfig = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Resend({
            from: "Nodlearn <no-reply@nodlearn.com>",
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if (!user || !user.password) return null

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isValid) return null

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        })
    ],

    session: { strategy: "jwt" },
    pages: {
        signIn: "/signin",
        verifyRequest: "/verify-email",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as { role?: string }).role ?? "USER"
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!
                // Fetch the latest role from the database to prevent stale token issues
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: token.sub! },
                        select: { role: true }
                    })
                    session.user.role = dbUser?.role ?? (token.role as "USER" | "ADMIN") ?? "USER"
                } catch (error) {
                    session.user.role = (token.role as "USER" | "ADMIN") ?? "USER"
                }
            }
            return session
        },
    },
    events: {
        async createUser({ user }) {
            // Send welcome email on signup
            if (user.email && user.name) {
                try {
                    const { EmailService } = await import("@/services/EmailService")
                    await Promise.all([
                        EmailService.sendWelcomeEmail(user.email, user.name),
                        EmailService.sendAdminNewUserEmail(user.name, user.email),
                    ])
                } catch (err) {
                    console.error("Email send error:", err)
                }
            }
        },
    },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
