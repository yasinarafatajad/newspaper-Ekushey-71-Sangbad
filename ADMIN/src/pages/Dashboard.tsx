import { FileText, FilePlus, FolderOpen, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { mockCategories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/lib/type";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { formatDate, formatDay } from "@/lib/formats";

const fetchAllNews = async (): Promise<Post[]> => {
  const { data } = await api.get("/AllNews");
  return data;
};

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const stats = [
    {
      label: "Total News",
      value: posts.length,
      icon: FileText,
    },
    {
      label: "Published",
      value: posts.filter((p) => p.status === "published").length,
      icon: Eye,
    },
    {
      label: "Drafts",
      value: posts.filter((p) => p.status === "draft").length,
      icon: FilePlus,
    },
    {
      label: "Categories",
      value: mockCategories.length,
      icon: FolderOpen,
    },
  ];

  const { data } = useQuery({
    queryKey: ["allNews"],
    queryFn: fetchAllNews,
  });

  useEffect(() => {
    if (data) setPosts(data ?? []);
  }, [data]);
  

  const today = new Date().toISOString();

  const recentPosts = posts?.reverse().slice(0, 5);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1 flex items-center gap-1">
            <span>{formatDate(today)},</span><span>{formatDay(today)}</span>
          </p>
        </div>
        <Button asChild className="rounded-sm">
          <Link to="/new-news">
            <FilePlus className="h-4 w-4 mr-2" />
            Add News
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-sm p-4"
          >
            <div className="flex items-center gap-3">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold font-heading text-foreground">
                  {stat.value}
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
      <div className="bg-card border border-border rounded-sm">
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
                <th className="p-3 font-semibold hidden sm:table-cell">Category</th>
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
                      variant={post.status === "published" ? "default" : "secondary"}
                      className={`rounded-sm text-xs ${post.status === "published"
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
