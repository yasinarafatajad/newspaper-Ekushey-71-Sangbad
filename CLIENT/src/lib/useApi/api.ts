import { Article, Category } from "@/lib/type";

export const api = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

export const REVALIDATE_NEWS = 60; // 60 seconds cache for news
export const REVALIDATE_CATEGORIES = 300; // 5 minutes cache for categories

export const getAllNews = async (): Promise<Article[]> => {
  try {
    const res = await fetch(`${api}/AllNews`, {
      next: { revalidate: REVALIDATE_NEWS },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch news");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getNews = async (slug: string): Promise<Article | null> => {
  try {
    const res = await fetch(`${api}/news/${slug}`, {
      next: { revalidate: REVALIDATE_NEWS },
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(`${api}/AllCategory`, {
      next: { revalidate: REVALIDATE_CATEGORIES },
    });

    if (!res.ok) throw new Error("Failed to fetch categories");

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
