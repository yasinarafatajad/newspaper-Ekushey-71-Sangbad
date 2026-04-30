import { FileText, FilePlus, FolderOpen, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Category, CategoryResponse, Post } from "@/lib/type";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { formatDate, formatDay, formatNumber } from "@/lib/formats";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const fetchAllNews = async (): Promise<Post[]> => {
  const { data } = await api.get("/AllNews");
  return data;
};

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [chartRange, setChartRange] = useState<7 | 30 | 90>(7);

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

  // Generate chart data based on selected range
  const dateList = Array.from({ length: chartRange }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  }).reverse();

  const chartData = dateList.map((date) => {
    const dateStr = date.toISOString().split("T")[0];
    const count = posts.filter(
      (p) => p.createdAt && p.createdAt.startsWith(dateStr)
    ).length;
    return {
      name: date.toLocaleDateString("bn-BD", { day: "2-digit", month: "short" }),
      সংবাদ: count,
    };
  });

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

      {/* Chart Overview */}
      <div className="bg-card border border-border rounded-sm mb-4 p-4">
        <h2 className="text-lg font-bold font-heading text-foreground mb-4">
          সংবাদ ওভারভিউ (গত {chartRange === 90 ? "৩ মাস" : `${formatNumber(chartRange)} দিন`})
        </h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatNumber(value as number)}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '2px',
                  color: 'hsl(var(--foreground))'
                }}
                itemStyle={{ color: 'hsl(var(--primary))' }}
              />
              <Line
                type="monotone"
                dataKey="সংবাদ"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={chartRange <= 30 ? { r: 4, fill: "hsl(var(--card))", strokeWidth: 2 } : false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Toggler */}
        <div className="flex justify-center items-center mt-6 gap-3">
          <Button 
            variant={chartRange === 7 ? "default" : "outline"} 
            size="sm" 
            onClick={() => setChartRange(7)}
          >
            ৭ দিন
          </Button>
          <Button 
            variant={chartRange === 30 ? "default" : "outline"} 
            size="sm" 
            onClick={() => setChartRange(30)}
          >
            ৩০ দিন
          </Button>
          <Button 
            variant={chartRange === 90 ? "default" : "outline"} 
            size="sm" 
            onClick={() => setChartRange(90)}
          >
            ৩ মাস
          </Button>
        </div>
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
