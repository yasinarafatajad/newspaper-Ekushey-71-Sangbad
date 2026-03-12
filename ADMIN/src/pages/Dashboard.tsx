import { FileText, FilePlus, FolderOpen, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { mockAuthors, mockCategories, Post } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockPosts: Post[] = [
  {
    id: "1",
    bnTitle: "জাতীয় নির্বাচনে নতুন কমিশন গঠন",
    enTitle: "hello test this case",
    slug: "new-election-commission",
    content: "জাতীয় নির্বাচনে নতুন কমিশন গঠিত হয়েছে। নতুন কমিশনের সদস্যরা তাদের দায়িত্ব পালন শুরু করেছেন।",
    categoryEN: "Politics",
    categoryBN: "রাজনীতি",
    author: mockAuthors[0],
    status: "published",
    date: "2026-03-10",
  },
  {
    id: "2",
    bnTitle: "জাতীয় নির্বাচনে নতুন কমিশন গঠন",
    enTitle: "hello test this case",
    slug: "new-election-commission",
    content: "জাতীয় নির্বাচনে নতুন কমিশন গঠিত হয়েছে। নতুন কমিশনের সদস্যরা তাদের দায়িত্ব পালন শুরু করেছেন।",
    categoryEN: "Politics",
    categoryBN: "রাজনীতি",
    author: mockAuthors[0],
    status: "published",
    date: "2026-03-10",
  }
]

const stats = [
  {
    label: "Total Posts",
    value: mockPosts.length,
    icon: FileText,
  },
  {
    label: "Published",
    value: mockPosts.filter((p) => p.status === "published").length,
    icon: Eye,
  },
  {
    label: "Drafts",
    value: mockPosts.filter((p) => p.status === "draft").length,
    icon: FilePlus,
  },
  {
    label: "Categories",
    value: mockCategories.length,
    icon: FolderOpen,
  },
];

const Dashboard = () => {
  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const recentPosts = mockPosts.slice(0, 5);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            {today}
          </p>
        </div>
        <Button asChild className="rounded-sm">
          <Link to="/new-post">
            <FilePlus className="h-4 w-4 mr-2" />
            New Post
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
            Recent Posts
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
                  key={post.id}
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
                    {post.date}
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
