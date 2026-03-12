import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockCategories, type Category } from "@/data/mockData";
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

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameBN, setEditNameBN] = useState("");
  const [editNameEN, setEditNameEN] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newNameBN, setNewNameBN] = useState("");
  const [newNameEN, setNewNameEN] = useState("");
  const newFormData = { newNameEN, newNameBN }
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditNameBN(cat.nameBN);
    setEditNameEN(cat.nameEN);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === editingId ? { ...c, nameBN: editNameBN, nameEN: editNameEN } : c
      )
    );
    // console.log('edited: ',editFormData);
    setEditingId(null);
  };

  const addCategory = () => {
    if (!newNameBN || !newNameEN) return;
    const newCat: Category = {
      id: String(Date.now()),
      nameBN: newNameBN,
      nameEN: newNameEN,
      postCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    // console.log('new added: ', newFormData);
    setNewNameBN("");
    setNewNameEN("");
    setShowAdd(false);
  };

  const handleDeleteCategory = () => {
    alert('no logic integrated!');
  }

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
              placeholder="বাংলা নাম"
              className="rounded-sm border-border font-body flex-1"
            />
            <Input
              value={newNameEN}
              onChange={(e) => setNewNameEN(e.target.value)}
              placeholder="English name"
              className="rounded-sm border-border font-body flex-1"
            />
            <Button size="icon" variant="ghost" onClick={addCategory} className="rounded-sm h-8 w-8">
              <Check className="h-4 w-4 text-success" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setShowAdd(false)} className="rounded-sm h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-3 border-b border-border last:border-0 hover:bg-accent/50"
          >
            {editingId === cat.id ? (
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
                <Button size="icon" variant="ghost" onClick={saveEdit} className="rounded-sm h-8 w-8">
                  <Check className="h-4 w-4 text-success" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="rounded-sm h-8 w-8">
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
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">পোস্ট মুছে ফেলুন?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              আপনি কি নিশ্চিত যে আপনি <span className="font-bold text-black">{deleteTarget?.nameBN}</span> মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm font-body">বাতিল</AlertDialogCancel>
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
