import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Check, X, Trash2 } from "lucide-react";
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
import { Category } from "../lib/type";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface CategoryResponse {
  success: boolean;
  data: Category[];
}
//fetch all categories
const fetchAllCategories = async (): Promise<CategoryResponse> => {
  const { data } = await api.get("/AllCategory");
  return data;
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameBN, setEditNameBN] = useState("");
  const [editNameEN, setEditNameEN] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newNameBN, setNewNameBN] = useState("");
  const [newNameEN, setNewNameEN] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  // get all category
  const { data } = useQuery({
    queryKey: ["AllCategories"],
    queryFn: fetchAllCategories,
  });
  useEffect(() => {
    if (data) setCategories(data?.data ?? []);
  }, [data]);

  // open edit form
  const startEdit = (cat: Category) => {
    setEditingId(cat._id);
    setEditNameBN(cat.nameBN);
    setEditNameEN(cat.nameEN);
  };

  // update category
  const saveEdit = async () => {
    if (!editingId) return;

    if (!editNameBN.trim() || !editNameEN.trim()) {
      toast({
        title: "তথ্য অসম্পূর্ণ",
        description: "বাংলা এবং ইংরেজি ক্যাটাগরি নাম অবশ্যই দিতে হবে।",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        nameBN: editNameBN.trim(),
        nameEN: editNameEN.trim(),
      };

      const res = await api.put(`/UpdateCategory/${editingId}`, payload);

      if (res.status !== 200) {
        throw new Error("Server failed to update category.");
      }

      const updatedCategory: Category = res?.data?.data;

      // refetch categories
      queryClient.invalidateQueries({ queryKey: ["AllCategories"] });

      toast({
        title: "ক্যাটাগরি আপডেট হয়েছে",
        description: `"${updatedCategory.nameBN}" সফলভাবে আপডেট করা হয়েছে।`,
      });

      // reset editing state
      setEditingId(null);
      setEditNameBN("");
      setEditNameEN("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred.";

      console.error("Update category error:", message);

      toast({
        title: "ক্যাটাগরি আপডেট করা যায়নি",
        description: message,
        variant: "destructive",
      });
    }
  };

  // create new category
  const addCategory = async () => {
    // basic validation
    if (!newNameBN.trim() || !newNameEN.trim()) {
      toast({
        title: "তথ্য অসম্পূর্ণ",
        description: "বাংলা এবং ইংরেজি ক্যাটাগরি নাম অবশ্যই দিতে হবে।",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        nameBN: newNameBN.trim(),
        nameEN: newNameEN.trim(),
      };

      const res = await api.post("/addCategory", payload);

      if (res.status !== 200) {
        throw new Error("Server failed to create category.");
      }
      // refetch
      queryClient.invalidateQueries({ queryKey: ["AllCategories"] });

      const newCategory: Category = res?.data.category;

      toast({
        title: "ক্যাটাগরি যোগ হয়েছে",
        description: `"${newCategory.nameBN}" সফলভাবে তৈরি হয়েছে।`,
      });

      // reset form
      setNewNameBN("");
      setNewNameEN("");
      setShowAdd(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred.";
      console.error("Add category error:", message);

      toast({
        title: "ক্যাটাগরি যোগ করা যায়নি",
        description: message,
        variant: "destructive",
      });
    }
  };

  // delete category
  const handleDeleteCategory = async () => {
    if (!deleteTarget?._id) return;

    try {
      const res = await api.delete(`/DeleteCategory/${deleteTarget?._id}`);

      if (res.status !== 200) {
        throw new Error("Server failed to delete category.");
      }

      // refetch categories
      queryClient.invalidateQueries({ queryKey: ["AllCategories"] });

      toast({
        title: "ক্যাটাগরি মুছে ফেলা হয়েছে",
        description: `"${deleteTarget.nameBN}" সফলভাবে মুছে ফেলা হয়েছে।`,
      });

      // reset delete state
      setDeleteTarget(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred.";

      console.error("Delete category error:", message);

      toast({
        title: "ক্যাটাগরি মুছে ফেলা যায়নি",
        description: message,
        variant: "destructive",
      });
    }
  };


  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-foreground">
          Categories
        </h1>
        <Button
          onClick={() => setShowAdd(true)}
          className="rounded-sm"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Category
        </Button>
      </div>

      <div className="bg-card border border-border rounded-sm">
        {showAdd && (
          <div className="flex items-center gap-2 p-3 border-b border-border">
            <Input
              value={newNameBN}
              onChange={(e) => setNewNameBN(e.target.value)}
              placeholder="বাংলা নাম *"
              className="rounded-sm border-border font-body flex-1"
            />
            <Input
              value={newNameEN}
              onChange={(e) => setNewNameEN(e.target.value)}
              placeholder="English name *"
              className="rounded-sm border-border font-body flex-1"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={addCategory}
              className="rounded-sm h-8 w-8"
            >
              <Check className="h-4 w-4 text-success" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowAdd(false)}
              className="rounded-sm h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {categories?.map((cat) => (
          <div
            key={cat._id}
            className="flex items-center justify-between p-3 border-b border-border last:border-0 hover:bg-accent/50"
          >
            {editingId === cat._id ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editNameBN}
                  onChange={(e) => setEditNameBN(e.target.value)}
                  className="rounded-sm border-border font-body flex-1"
                />
                <Input
                  value={editNameEN}
                  onChange={(e) => setEditNameEN(e.target.value)}
                  className="rounded-sm border-border font-body flex-1"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={saveEdit}
                  className="rounded-sm h-8 w-8"
                >
                  <Check className="h-4 w-4 text-success" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingId(null)}
                  className="rounded-sm h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <span className="font-body text-foreground font-semibold">
                    {cat.nameBN}
                  </span>
                  <span className="text-muted-foreground ml-2 text-sm">
                    ({cat.nameEN})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-body">
                    {cat.postCount} news
                  </span>
                  <div className="p-3 text-right">
                    <div className="flex items-center justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(cat)}
                        className="rounded-sm h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-sm text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(cat)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
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
              আপনি কি নিশ্চিত যে আপনি{" "}
              <span className="font-bold text-black">
                {deleteTarget?.nameBN}
              </span>{" "}
              মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm font-body">
              বাতিল
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
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

export default Categories;
