// news article
export interface Article {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    author: string
    publishedAt: string
    updatedAt: string | null
    featuredImage: string
    tags: string[]
    views: number
    isFeatured: boolean
}