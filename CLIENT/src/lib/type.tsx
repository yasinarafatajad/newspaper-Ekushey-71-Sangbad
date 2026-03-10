import { StaticImageData } from "next/image"

// news article
export interface Article {
    id: string
    title: string
    slug: string
    content: string
    categoryEN: string
    categoryBN: string
    author: {
        title: string
        src: string
        location: string
    },
    publishedAt: string
    updatedAt: string | null
    featuredImage: string
    imageCaption: string
    tags: string[]
    views: number
    isFeatured: boolean
}
export interface AUTHOR {
    name: string
    src: string | StaticImageData
    location: string
    publishedAt: string
}