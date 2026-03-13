import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Post } from "@/lib/type";
import { formatDate } from "@/lib/formats";

const fetchAllNews = async (): Promise<Post[]> => {
  const { data } = await api.get("/AllNews");
  return data;
};
const deleteNews = async (
  id: string,
): Promise<{ success: boolean; deletedPost?: Post }> => {
  try {
    const { data } = await api.delete(`/DeleteNews/${id}`);
    return data;
  } catch (error) {
    console.error("Failed to delete news:", error);
    throw new Error("CLIENT-fn: Unable to delete post. Please try again.");
  }
};

const AllPosts = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["allNews"],
    queryFn: fetchAllNews,
  });

  useEffect(() => {
    if (data) setPosts(data ?? []);
  }, [data]);

  const filtered = posts.filter((post) => {
    const matchesSearch =
      post.enTitle.toLowerCase().includes(search.toLowerCase()) ||
      post.bnTitle.toLowerCase().includes(search) ||
      post.categoryBN.toLowerCase().includes(search.toLowerCase()) ||
      post.categoryEN
        .toLowerCase()
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      // Call API to delete the post
      const response = await deleteNews(deleteTarget._id);

      // Refetch all posts after successful deletion
      queryClient.invalidateQueries({ queryKey: ["allNews"] });

      // Show success toast
      toast({
        title: "পোস্ট মুছে ফেলা হয়েছে",
        description: `"${deleteTarget.bnTitle}" সফলভাবে মুছে ফেলা হয়েছে।`,
      });
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: "পোস্ট মুছে ফেলা যায়নি",
        description:
          err instanceof Error
            ? err.message
            : "অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      // Clear delete target in any case
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-foreground mb-6">
        All News
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="pl-9 rounded-sm border-border font-body"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((s, i) => (
            <Button
              key={i}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className="rounded-sm capitalize font-body"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
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
            {filtered?.reverse().map((post) => (
              <tr
                key={post?._id}
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
                    className={`rounded-sm text-xs ${
                      post.status === "published"
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
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 rounded-sm"
                    >
                      <Link to={`/news/${post._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 rounded-sm"
                    >
                      <Link to={`/edit-news/${post._id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-sm text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(post)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground"
                >
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">
              পোস্ট মুছে ফেলুন?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              আপনি কি নিশ্চিত যে আপনি "{deleteTarget?.bnTitle}" মুছে ফেলতে চান?
              এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm font-body">
              বাতিল
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
            >
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AllPosts;
