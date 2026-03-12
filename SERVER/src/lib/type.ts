
export interface NEWS {
    bnTitle: string
    enTitle: string
    slug: string
    content: string
    categoryEN: string
    categoryBN: string
    author: {
        title: string
        src: string
        location: string
    },
    featuredImage: string
    imageCaption: string
    tags: string[]
    views: number
    isFeatured: boolean
    status: string
}
export interface AUTHOR {
    name: string
    src: string 
    location: string
}
export interface Category {
  nameEN: string;
  nameBN: string;
  postCount?: number;
}