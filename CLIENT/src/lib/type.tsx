import { StaticImageData } from "next/image"

export interface Article {
    _id: string
    bnTitle: string
    enTitle: string
    slug: string
    content: string
    categoryEN: string
    categoryBN: string
    author: {
        name: string
        title: string
        src: string
        location: string
    },
    createdAt: string
    updatedAt: string | null
    featuredImage: string
    imageCaption: string
    tags: string[]
    views: number
    isFeatured: boolean
}
export interface AUTHOR {
    name: string
    title: string
    src: string | StaticImageData
    location: string
    publishedAt: string
}
export interface Category {
  _id: string;
  nameEN: string;
  nameBN: string;
  postCount?: number;
}