import { Article, Category } from "@/lib/type";

export const api = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

export const REVALIDATE_NEWS = 60; // 60 seconds cache for news
export const REVALIDATE_CATEGORIES = 300; // 5 minutes cache for categories

// The public site must never render drafts, so always ask the API for
// published posts. The API returns them newest first.
export const getAllNews = async (): Promise<Article[]> => {
  const url = `${api}/AllNews?status=published`;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_NEWS },
    });

    if (!res.ok) {
      throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    return Array.isArray(json) ? (json as Article[]) : [];
  } catch (error) {
    // Never break the whole page, but make the cause visible in the server logs.
    console.error("[news] getAllNews failed:", error);
    return [];
  }
};

export const getNews = async (slug: string): Promise<Article | null> => {
  const url = `${api}/news/${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_NEWS },
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json && typeof json === "object" ? (json as Article) : null;
  } catch (error) {
    console.error(`[news] getNews(${slug}) failed:`, error);
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
