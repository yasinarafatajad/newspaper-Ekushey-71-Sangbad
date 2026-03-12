
export interface Author {
    name: string;
    title: string;
    src: string;
    location: string;
}

export interface Post {
    _id?: string;
    id?: string;
    bnTitle: string;
    enTitle: string;
    slug: string;
    content: string;
    categoryEN: string;
    categoryBN: string;
    featuredImage?: string;
    imageCaption?: string;
    tags?: string[];
    author: Author;
    status: string;
    createdAt?: string;
    date?: string;
}

export interface Category {
    _id?: string;
    id?: string;
    nameEN: string;
    nameBN: string;
    postCount: number;
}