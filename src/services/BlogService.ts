import { prisma } from "@/lib/prisma"

export class BlogService {
    /**
     * Fetch all published blog posts with author info
     */
    static async getPublishedPosts(take?: number) {
        return prisma.blogPost.findMany({
            where: { publishedAt: { not: null } },
            orderBy: { publishedAt: "desc" },
            take,
            include: { author: { select: { name: true } } },
        })
    }

    /**
     * Create a new blog post
     */
    static async createPost(data: {
        title: string
        slug: string
        content: string
        coverImage?: string
        authorId: string
    }) {
        return prisma.blogPost.create({
            data: {
                ...data,
                publishedAt: new Date(),
            },
        })
    }

    /**
     * Delete a blog post by ID
     */
    static async deletePost(id: string) {
        return prisma.blogPost.delete({
            where: { id },
        })
    }
}
