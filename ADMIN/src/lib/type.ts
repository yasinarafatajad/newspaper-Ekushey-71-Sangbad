export interface Author {
  _id?: string;
  name: string;
  title: string;
  src: string;
  location: string;
  email?: string;
  username?: string;
  password?: string;
}

export interface Post {
  _id?: string;
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
  views?: number;
  createdAt?: string;
  date?: string;
}

export interface Category {
  id?: string;
  _id?: string;
  nameEN: string;
  nameBN: string;
  postCount: number;
}
// type category
export interface CategoryResponse {
  success: boolean;
  data: Category[];
}
