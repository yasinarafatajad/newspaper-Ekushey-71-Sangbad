import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { UserPlus, Eye, Edit, Trash2, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Author } from "@/lib/type";
import { Link } from "react-router-dom";
import AuthorCard from "@/components/AuthorCard";

// Fetch All Authors
const fetchAllAuthors = async (): Promise<{ data: Author[] }> => {
  const { data } = await api.get("/AllAuthors");
  return data;
};

const EMPTY_FORM = {
  name: "",
  title: "",
  location: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const Authors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Author | null>(null);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Image upload state (mirrors NewPost.tsx pattern)
  const [photoLocal, setPhotoLocal] = useState<File | null>(null); // selected file
  const [photoPreview, setPhotoPreview] = useState<string | null>(null); // preview data URL
  const [photoUrl, setPhotoUrl] = useState(""); // final Cloudinary URL
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const queryClient = useQueryClient();

  // Fetch All Authors
  const { data: authorsData } = useQuery({
    queryKey: ["allAuthors"],
    queryFn: fetchAllAuthors,
  });

  useEffect(() => {
    if (authorsData) setAuthors(authorsData.data ?? []);
  }, [authorsData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // scroll to top smoothly
  const scrollToTop = (duration = 1000) => {
    const start = window.scrollY;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo(0, start * (1 - progress));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleEditClick = (author: Author) => {
    //  scroll to top smoothly
    scrollToTop(500);
    // set editing author
    setEditingAuthor(author);
    setForm({
      name: author.name,
      title: author.title,
      location: author.location,
      email: author.email || "",
      username: author.username || "",
      password: "",
      confirmPassword: "",
    });
    setPhotoPreview(author.src);
    setPhotoUrl(author.src);
    setPhotoLocal(null);
  };

  // File selected → show local preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "ফাইল অনেক বড়",
          description: "ছবির সাইজ ১০ মেগাবাইটের (10 MB) বেশি হতে পারবে না।",
          variant: "destructive",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setPhotoLocal(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setPhotoLocal(null);
    setPhotoPreview(null);
    setPhotoUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Upload to Cloudinary — returns secure_url or null
  const uploadToCloudinary = async (): Promise<string | null> => {
    if (!photoLocal) return null;

    const formData = new FormData();
    formData.append("file", photoLocal);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "Ekushey71/Authors");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData },
      );
      const json = await res.json();
      if (json.secure_url) {
        setPhotoUrl(json.secure_url);
        return json.secure_url;
      }
      return null;
    } catch (err) {
      console.error("Image upload failed", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.title.trim() || !form.location.trim()) {
      toast({
        title: "তথ্য অসম্পূর্ণ",
        description: "নাম, পদবী এবং স্থান পূরণ করুন।",
        variant: "destructive",
      });
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (!photoLocal && !photoUrl) {
      toast({
        title: "ছবি প্রয়োজন",
        description: "লেখকের ছবি আপলোড করুন।",
        variant: "destructive",
      });
      return;
    }

    // Validated, open confirm
    setShowConfirmSubmit(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmSubmit(false);
    try {
      // Upload image first, then submit
      let src = photoUrl;
      if (photoLocal) {
        const uploadedUrl = await uploadToCloudinary();
        if (uploadedUrl) src = uploadedUrl;
      }

      if (!src) {
        toast({
          title: "ছবি আপলোড ব্যর্থ",
          description: "ছবি আপলোড করা যায়নি। আবার চেষ্টা করুন।",
          variant: "destructive",
        });
        return;
      }

      let res;
      if (editingAuthor) {
        res = await api.put(`/author/${editingAuthor._id}`, {
          ...form,
          src,
        }); // Adjust /author to /UpdateAuthor if it matches NewPost style
      } else {
        res = await api.post("/addAuthor", { ...form, src });
      }

      if (res.status !== 200 && res.status !== 201) {
        throw new Error(
          editingAuthor
            ? "Server failed to update author."
            : "Server failed to create author.",
        );
      }

      queryClient.invalidateQueries({ queryKey: ["allAuthors"] });
      setForm(EMPTY_FORM);
      removeImage();
      setEditingAuthor(null);

      toast({
        title: editingAuthor ? "লেখক আপডেট হয়েছে" : "লেখক যোগ হয়েছে",
        description: `"${form.name}" সফলভাবে ${editingAuthor ? "আপডেট" : "তৈরি"} হয়েছে।`,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred.";
      toast({
        title: editingAuthor ? "লেখক আপডেট করা যায়নি" : "লেখক যোগ করা যায়নি",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await api.delete(`/author/${deleteTarget._id}`);
      queryClient.invalidateQueries({ queryKey: ["allAuthors"] });
      toast({
        title: "লেখক মুছে ফেলা হয়েছে",
        description: `"${deleteTarget.name}" সফলভাবে মুছে ফেলা হয়েছে।`,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred.";
      toast({
        title: "লেখক মুছে ফেলা যায়নি",
        description: message,
        variant: "destructive",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-foreground mb-6">
        Authors
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Add Author Form */}
        <div className="bg-card border border-border rounded-sm p-5">
          <h2 className="text-lg font-bold font-heading text-foreground mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {editingAuthor ? "Edit Author" : "Add New Author"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* name */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="name"
                className="font-body text-sm text-muted-foreground"
              >
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Your Name"
                className="rounded-sm border-border font-body"
              />
            </div>
            {/* title */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="title"
                className="font-body text-sm text-muted-foreground"
              >
                Title / Designation <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Senior Reporter"
                className="rounded-sm border-border font-body"
              />
            </div>
            {/* location */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="location"
                className="font-body text-sm text-muted-foreground"
              >
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Dhaka"
                className="rounded-sm border-border font-body"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="font-body text-sm text-muted-foreground"
              >
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="author@example.com"
                className="rounded-sm border-border font-body"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="username"
                className="font-body text-sm text-muted-foreground"
              >
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="author123"
                className="rounded-sm border-border font-body"
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="password"
                  className="font-body text-sm text-muted-foreground"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    editingAuthor ? "Leave blank to keep same" : "****"
                  }
                  className="rounded-sm border-border font-body"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="font-body text-sm text-muted-foreground"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="****"
                  className="rounded-sm border-border font-body"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div className="flex flex-col gap-1.5">
              <Label className="font-body text-sm text-muted-foreground">
                Author Photo (recommended square size){" "}
                <span className="text-destructive">*</span>
              </Label>
              <div>
                {photoPreview ? (
                  <div className="relative border border-border overflow-hidden aspect-square max-w-72">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover aspect-square rounded-full"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeImage}
                      className="absolute top-2 right-2 h-7 w-7 rounded-sm bg-background/80 hover:bg-background"
                    >
                      <X className="h-8 w-8" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  >
                    <Upload className="h-6 w-6" />
                    <span className="font-body text-sm">
                      ছবি আপলোড করুন (max 10 MB)
                    </span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* submit button */}
            <Button
              type="submit"
              className="rounded-sm font-body w-full mt-1"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? editingAuthor
                  ? "Updating..."
                  : "Uploading & Adding..."
                : editingAuthor
                  ? "Update Author"
                  : "Add Author"}
            </Button>
            {editingAuthor && (
              <Button
                type="button"
                variant="outline"
                className="rounded-sm font-body w-full mt-1"
                onClick={() => {
                  setEditingAuthor(null);
                  setForm(EMPTY_FORM);
                  removeImage();
                }}
              >
                Cancel Edit
              </Button>
            )}
          </form>
        </div>

        {/* RIGHT: Author List */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold font-heading text-foreground">
            Authors ({authors.length})
          </h2>

          {/* Desktop Table */}
          <div className="hidden sm:block bg-card border border-border rounded-sm overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-3 font-semibold">Author</th>
                  <th className="p-3 font-semibold hidden md:table-cell">
                    Title
                  </th>
                  <th className="p-3 font-semibold hidden lg:table-cell">
                    Location
                  </th>
                  <th className="p-3 font-semibold hidden lg:table-cell">
                    username & Email
                  </th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {authors.map((author) => (
                  <tr
                    key={author._id}
                    className="border-b border-border last:border-0 hover:bg-accent/50"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={author.src}
                          alt={author.name}
                          className="h-8 w-8 rounded-full object-cover border border-border aspect-square"
                        />
                        <span className="font-semibold text-foreground">
                          {author.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">
                      {author.title}
                    </td>
                    <td className="p-3 hidden lg:table-cell text-muted-foreground">
                      {author.location}
                    </td>
                    <td className="p-3 hidden xl:table-cell text-muted-foreground text-xs">
                      {author.email || author.username ? (
                        <div className="flex flex-col">
                          {author.email && <span>{author.email}</span>}
                          {author.username && <span>@{author.username}</span>}
                        </div>
                      ) : (
                        <span className="flex items-center justify-center">-</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 rounded-sm"
                        >
                          <Link to={`/author/${author._id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-sm text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => handleEditClick(author)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(author)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {authors.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No authors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden flex flex-col gap-3">
            {authors.length === 0 && (
              <p className="text-center text-muted-foreground font-body p-4">
                No authors found.
              </p>
            )}
            {authors.map((author) => (
              <AuthorCard
                key={author._id}
                author={author}
                onEdit={(a) => handleEditClick(a)}
                onDelete={(a) => setDeleteTarget(a)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">
              লেখক মুছে ফেলুন?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              আপনি কি নিশ্চিত যে আপনি{" "}
              <span className="font-bold text-foreground">
                "{deleteTarget?.name}"
              </span>{" "}
              মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
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
      <AlertDialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">
              {editingAuthor ? "লেখক আপডেট করবেন?" : "লেখক যোগ করবেন?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              আপনি কি নিশ্চিত যে আপনি এই লেখকের তথ্য সংরক্ষণ করতে চান?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm font-body">
              বাতিল
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSubmit}
              className="rounded-sm bg-primary text-primary-foreground font-body"
            >
              নিশ্চিত করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Authors;
