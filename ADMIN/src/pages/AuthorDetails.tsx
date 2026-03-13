import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, BadgeCheck, Newspaper } from "lucide-react";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Author, Post } from "@/lib/type";
import { formatDate } from "@/lib/formats";
import { log } from "util";

// Fetch Author
const fetchAuthor = async (id: string): Promise<Author> => {
  const { data } = await api.get(`/author/${id}`);
  return data;
};

// Fetch Author Articles
const fetchAuthorPosts = async (id: string): Promise<{ data: Post[] }> => {
  const { data } = await api.get(`/NewsByAuthor/${id}`);
  return data;
};

const AuthorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<Post[]>([]);
  const [isAuthor, setIsAuthor] = useState<Author>();

  // Fetch Author
  const { data: author, isLoading: authorLoading } = useQuery({
    queryKey: ["author", id],
    queryFn: () => fetchAuthor(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (author) setIsAuthor(author);
  }, [author]);

  // Fetch Author Articles
  const { data: newsData } = useQuery({
    queryKey: ["authorPosts", id],
    queryFn: () => fetchAuthorPosts(id!),
    enabled: !!id,
  });
  useEffect(() => {
    if (newsData) setNews(newsData?.data ?? []);
  }, [newsData]);

  if (authorLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-muted-foreground font-body">Loading...</p>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <p className="text-muted-foreground font-body">Author not found.</p>
        <Button asChild variant="outline" className="rounded-sm font-body">
          <Link to="/authors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Authors
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <div className="mb-6">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="rounded-sm font-body -ml-2"
        >
          <Link to="/authors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Authors
          </Link>
        </Button>
      </div>

      {/* Author Profile Card */}
      <div className="bg-card border border-border rounded-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={isAuthor?.src}
            alt={isAuthor?.name}
            className="h-20 w-20 rounded-full object-cover border-2 border-border flex-shrink-0"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-heading text-foreground">
              {isAuthor?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-body">
                <BadgeCheck className="h-4 w-4" />
                <span>{isAuthor?.title}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-body">
                <MapPin className="h-4 w-4" />
                <span>{isAuthor?.location}</span>
              </div>
            </div>
          </div>
          {/* Stats */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
            <p className="text-2xl font-bold font-heading text-foreground">
              {news.length}
            </p>
            <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
              <Newspaper className="h-3 w-3" /> articles
            </p>
          </div>
        </div>
      </div>

      {/* Author's Posts */}
      <div>
        <h2 className="text-lg font-bold font-heading text-foreground mb-4">
          Articles by {author.name}
        </h2>

        <div className="bg-card border border-border rounded-sm overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-3 font-semibold">Title</th>
                <th className="p-3 font-semibold hidden sm:table-cell">
                  Category
                </th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold hidden md:table-cell">Date</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map((post) => (
                <tr
                  key={post._id}
                  className="border-b border-border last:border-0 hover:bg-accent/50"
                >
                  <td className="p-3 text-foreground">{post.bnTitle}</td>
                  <td className="p-3 hidden sm:table-cell text-muted-foreground">
                    {post.categoryBN}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        post.status === "published" ? "default" : "secondary"
                      }
                      className={`rounded-sm text-xs ${
                        post.status === "published"
                          ? "bg-success text-success-foreground"
                          : ""
                      }`}
                    >
                      {post.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 rounded-sm"
                    >
                      <Link to={`/news/${post._id}`}>
                        <Newspaper className="h-4 w-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {news.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No articles found for this author.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetails;
