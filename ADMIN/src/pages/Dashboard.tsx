import { FileText, FilePlus, FolderOpen, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Category, CategoryResponse, Post } from "@/lib/type";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { formatDate, formatDay, formatNumber } from "@/lib/formats";

const fetchAllNews = async (): Promise<Post[]> => {
  const { data } = await api.get("/AllNews");
  return data;
};

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const stats = [
    {
      label: "মোট সংবাদ",
      value: posts.length,
      icon: FileText,
    },
    {
      label: "প্রকাশিত",
      value: posts.filter((p) => p.status === "published").length,
      icon: Eye,
    },
    {
      label: "খসড়া",
      value: posts.filter((p) => p.status === "draft").length,
      icon: FilePlus,
    },
    {
      label: "বিভাগসমূহ",
      value: categories.length,
      icon: FolderOpen,
    },
  ];

  // fetch all news
  const { data } = useQuery({
    queryKey: ["allNews"],
    queryFn: fetchAllNews,
  });

  useEffect(() => {
    if (data) setPosts(data ?? []);
  }, [data]);

  // fetch all category
  const fetchAllCategories = async (): Promise<CategoryResponse> => {
    const { data } = await api.get("/AllCategory");
    return data;
  };

  const { data: categoryData } = useQuery({
    queryKey: ["AllCategories"],
    queryFn: fetchAllCategories,
  });

  useEffect(() => {
    if (categoryData) setCategories(categoryData?.data ?? []);
  }, [categoryData]);

  const today = new Date().toISOString();

  const recentPosts = posts?.reverse().slice(0, 5);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1 flex items-center gap-1">
            <span>{formatDate(today)},</span>
            <span>{formatDay(today)}</span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-sm p-4"
          >
            <div className="flex items-center gap-3">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold font-heading text-foreground">
                  {formatNumber(stat.value)}
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-card border border-border rounded-sm mb-4">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold font-heading text-foreground">
            Recent News
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-3 font-semibold">Title</th>
                <th className="p-3 font-semibold hidden sm:table-cell">
                  Category
                </th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.map((post) => (
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
                        post.status === "published" ? "default" : "outline"
                      }
                      className={`rounded-sm text-xs ${post.status === "published"
                          ? "bg-success text-success-foreground"
                          : "bg-blue-500 text-success-foreground"
                        }`}
                    >
                      {post.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">
                    {formatDate(post.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add News Button */}
      <div className="flex flex-col items-center justify-center">
        <Button asChild className="rounded-sm w-full">
          <Link to="/new-news">
            <FilePlus className="h-4 w-4 mr-2" />
            Add News
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
