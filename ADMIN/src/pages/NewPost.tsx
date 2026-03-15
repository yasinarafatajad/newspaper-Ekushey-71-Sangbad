import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, LoaderCircle, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Author, Category, CategoryResponse, Post } from "@/lib/type";

// Fetch All Authors
const fetchAllAuthors = async (): Promise<{ data: Author[] }> => {
  const { data } = await api.get("/AllAuthors");
  return data;
};

const NewPost = () => {
  // React Router hooks
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Cloudinary configuration from environment variables
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Main editing post state
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);

  // Local state for form fields
  const [bnTitle, setBnTitle] = useState("");
  const [enTitle, setEnTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryBN, setCategoryBN] = useState("");
  const [categoryEN, setCategoryEN] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState<Author | null>(null);
  const [featuredImageLocal, setFeaturedImageLocal] = useState<File | null>(
    null,
  );
  const [featuredImage, setFeaturedImage] = useState(""); // uploaded image URL
  const [imagePreview, setImagePreview] = useState<string | null>(null); // preview before upload
  const [imageCaption, setImageCaption] = useState(""); // image caption
  const [tags, setTags] = useState<string[]>([]); // tag list
  const [tagInput, setTagInput] = useState(""); // tag input field
  const [status, setStatus] = useState<string>("draft"); // draft/published
  const [isTyping, setIsTyping] = useState(false); // content editor typing state
  const [publishState, setPublishState] = useState<
    "idle" | "publishing" | "success"
  >("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Handlers for content editor focus/blur
  const handleContentFocus = () => setIsTyping(true);
  const handleContentBlur = () => setIsTyping(false);

  // Fetch a single post by ID
  const fetchNews = async (postId: string): Promise<Post> => {
    const { data } = await api.get(`/news/${postId}`);
    return data; // returns a single Post object
  };

  const { data, isLoading, isError, error } = useQuery<Post>({
    queryKey: ["news", id],
    queryFn: () => fetchNews(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (!data) return;

    // set editing post
    setEditingPost(data);

    // populate local states
    setBnTitle(data.bnTitle || "");
    setEnTitle(data.enTitle || "");
    setSlug(data.slug || "");
    setCategoryBN(data.categoryBN || "");
    setCategoryEN(data.categoryEN || "");
    setContent(data.content || "");
    setAuthor(data.author || null);
    setFeaturedImage(data.featuredImage || "");
    setImagePreview(data.featuredImage || "");
    setImageCaption(data.imageCaption || "");
    setTags(data.tags || []);
    setStatus(data.status || "draft");
  }, [data]);

  // fetch categories
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

  // Fetch All Authors
  const { data: authorsData } = useQuery({
    queryKey: ["allAuthors"],
    queryFn: fetchAllAuthors,
  });

  useEffect(() => {
    if (authorsData) setAuthors(authorsData.data ?? []);
  }, [authorsData]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")      // remove special chars
      .replace(/\s+/g, "-")          // spaces → dash
      .replace(/-+/g, "-")           // multiple dashes → single dash
      .replace(/^-+/, "")            // remove starting dash
      .replace(/-+$/, "");           // remove trailing dash
  };

  const handleEnTitleChange = (value: string) => {
    setEnTitle(value);
    setSlug(generateSlug(value));
  };
  const handleBnTitleChange = (value: string) => {
    setBnTitle(value);
  };

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
      setFeaturedImageLocal(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFeaturedImageLocal(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // const addTag = () => {
  //   const trimmed = tagInput.trim();
  //   if (trimmed && !tags.includes(trimmed)) {
  //     setTags([...tags, trimmed]);
  //   }
  //   setTagInput("");
  // };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes(",")) {
      const parts = val.split(",");
      const newTags = parts
        .map((p) => p.trim())
        .filter((p) => p && !tags.includes(p));
      if (newTags.length > 0) {
        setTags([...tags, ...newTags]);
      }
      setTagInput("");
    } else {
      setTagInput(val);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // addTag(); // Removing addTag on Enter per requirement
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleCategoryChange = (value: string) => {
    const selected = categories.find((cat) => cat.nameEN === value);
    if (selected) {
      setCategoryEN(selected.nameEN);
      setCategoryBN(selected.nameBN);
    }
  };

  const handleAuthor = (value: string) => {
    const author = authors.find((a) => a.name === value);
    if (author) setAuthor(author);
  };

  const handleImgUpload = async () => {
    if (!featuredImageLocal) return null;

    const data = new FormData();
    data.append("file", featuredImageLocal);
    data.append("upload_preset", uploadPreset);
    data.append("folder", "Ekushey71/News");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: data,
        },
      );

      const json = await res.json();

      if (json.secure_url) {
        setFeaturedImage(json.secure_url);
        return json.secure_url;
      }
      return null;
    } catch (err) {
      console.error("Image upload failed", err);
      return null;
    }
  };

  // Create a new post
  const createPost = async (formData: Post): Promise<boolean> => {
    try {
      const res = await api.post("/newPost", formData);
      if (res.status === 200 || res.status === 201) {
        toast({
          title: "পোস্ট প্রকাশিত হয়েছে",
          description: `"${formData.bnTitle}" সফলভাবে প্রকাশিত হয়েছে।`,
        });
        queryClient.invalidateQueries({ queryKey: ["allNews"] });
        return true;
      }
      return false;
    } catch (err: unknown) {
      console.error("Create post error:", err);
      const errResponse = err as { response?: { data?: { message?: string } } };
      const message =
        errResponse.response?.data?.message ||
        (err instanceof Error ? err.message : String(err));
      toast({
        title: "পোস্ট প্রকাশ করা যায়নি",
        description: message || "অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update an existing post
  const updatePost = async (id: string, formData: Post): Promise<boolean> => {
    try {
      const res = await api.put(`/UpdateNews/${id}`, formData);
      if (res.status === 200) {
        toast({
          title: "পোস্ট আপডেট হয়েছে",
          description: `"${formData.bnTitle}" সফলভাবে আপডেট করা হয়েছে।`,
        });
        queryClient.invalidateQueries({ queryKey: ["allNews"] });
        return true;
      }
      return false;
    } catch (err: unknown) {
      console.error("Update post error:", err);
      const errResponse = err as { response?: { data?: { message?: string } } };
      const message =
        errResponse.response?.data?.message ||
        (err instanceof Error ? err.message : String(err));
      toast({
        title: "পোস্ট আপডেট করা যায়নি",
        description: message || "অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
        variant: "destructive",
      });
      return false;
    }
  };

  // submit
  const handleSubmit = async () => {
    if (!enTitle || !bnTitle || !content) {
      toast({
        title: "ফর্ম অসম্পূর্ণ",
        description: "বাংলা/ইংরেজি শিরোনাম এবং কনটেন্ট অবশ্যই থাকতে হবে।",
        variant: "destructive",
      });
      return;
    }

    setPublishState("publishing");

    try {
      const uploadImg = await handleImgUpload();
      const formData: Post = {
        bnTitle: bnTitle.trim(),
        enTitle: enTitle.trim(),
        slug: slug.trim(),
        content: content.trim(),
        categoryBN,
        categoryEN,
        author,
        featuredImage: uploadImg || featuredImage,
        imageCaption: imageCaption.trim(),
        tags,
        status,
      };

      let success = false;
      if (editingPost?._id) {
        success = await updatePost(editingPost._id, formData);
      } else {
        success = await createPost(formData);
      }

      if (success) {
        setPublishState("success");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setPublishState("idle");
      }
    } catch (err: unknown) {
      console.error("Error in handleSubmit:", err);
      setPublishState("idle");
      const errResponse = err as { response?: { data?: { message?: string } } };
      const message =
        errResponse.response?.data?.message ||
        (err instanceof Error ? err.message : String(err));
      toast({
        title: "সমস্যা হয়েছে",
        description: message || "অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    }
  };

  const fadeClass = (typing: boolean) =>
    `transition-opacity duration-300 ${typing ? "opacity-25" : "opacity-100"}`;

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-foreground mb-6">
        {editingPost ? "Edit News" : "Upload News"}
      </h1>

      <div className="space-y-5 max-w-3xl">
        {/* Bangla Title */}
        <div className={fadeClass(isTyping)}>
          <Label htmlFor="bnTitle" className="font-body text-sm font-semibold">
            Bangla Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bnTitle"
            value={bnTitle}
            onChange={(e) => handleBnTitleChange(e.target.value)}
            placeholder="পোস্টের শিরোনাম লিখুন..."
            className="mt-1 rounded-sm border-border font-body"
          />
        </div>

        {/* English Title */}
        <div className={fadeClass(isTyping)}>
          <Label htmlFor="enTitle" className="font-body text-sm font-semibold">
            English Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="enTitle"
            value={enTitle}
            onChange={(e) => handleEnTitleChange(e.target.value)}
            placeholder="পোস্টের শিরোনাম লিখুন..."
            className="mt-1 rounded-sm border-border font-body"
          />
        </div>

        {/* Slug */}
        <div className={fadeClass(isTyping)}>
          <Label htmlFor="slug" className="font-body text-sm font-semibold">
            Slug
          </Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="unique-post-slug"
            className="mt-1 rounded-sm border-border font-mono text-sm"
          />
        </div>

        {/* Author Name */}
        <div className={fadeClass(isTyping)}>
          <Label htmlFor="category" className="font-body text-sm font-semibold">
            Author Name <span className="text-destructive">*</span>
          </Label>
          <Select value={author?.name} onValueChange={handleAuthor}>
            <SelectTrigger className="mt-1 rounded-sm border-border font-body">
              <SelectValue placeholder="লেখকের নাম..." />
            </SelectTrigger>
            <SelectContent>
              {authors.map((author, index) => (
                <SelectItem key={index} value={author.name}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className={fadeClass(isTyping)}>
          <Label htmlFor="category" className="font-body text-sm font-semibold">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select value={categoryEN} onValueChange={handleCategoryChange}>
            <SelectTrigger className="mt-1 rounded-sm border-border font-body">
              <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat.nameEN}>
                  {cat.nameBN} ({cat.nameEN})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Featured Image */}
        <div className={fadeClass(isTyping)}>
          <Label className="font-body text-sm font-semibold">
            Featured Image{" "}
            <span className="text-xs text-muted-foreground">
              (recommended : 16 * 9)
            </span>{" "}
            <span className="text-destructive">*</span>
          </Label>
          <div className="mt-1">
            {imagePreview ? (
              <div className="relative border border-border rounded-sm overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeImage}
                  className="absolute top-2 right-2 h-7 w-7 rounded-sm bg-background/80 hover:bg-background"
                >
                  <X className="h-4 w-4" />
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

        {/* Image Caption */}
        {imagePreview && (
          <div className={fadeClass(isTyping)}>
            <Label
              htmlFor="caption"
              className="font-body text-sm font-semibold"
            >
              Image Caption
            </Label>
            <Input
              id="caption"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              placeholder="ছবির ক্যাপশন লিখুন..."
              className="mt-1 rounded-sm border-border font-body"
            />
          </div>
        )}

        {/* Tags */}
        <div className={fadeClass(isTyping)}>
          <Label htmlFor="tags" className="font-body text-sm font-semibold">
            Tags
          </Label>
          <div className="mt-1 flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-sm font-body gap-1 pr-1"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Input
            id="tags"
            value={tagInput}
            onChange={handleTagChange}
            onKeyDown={handleTagKeyDown}
            placeholder="ট্যাগ লিখে কমা (,) চাপুন..."
            className="rounded-sm border-border font-body"
          />
        </div>

        {/* Content */}
        <div>
          <Label htmlFor="content" className="font-body text-sm font-semibold">
            Content <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={handleContentFocus}
            onBlur={handleContentBlur}
            placeholder="পোস্টের বিষয়বস্তু লিখুন..."
            className="mt-1 rounded-sm border-border font-body min-h-[250px]"
          />
        </div>

        {/* Status */}
        <div className={fadeClass(isTyping)}>
          <Label htmlFor="category" className="font-body text-sm font-semibold">
            Status
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="mt-1 rounded-sm border-border font-body">
              <SelectValue placeholder="News Status..." />
            </SelectTrigger>
            <SelectContent>
              {["published", "draft"].map((e, index) => (
                <SelectItem key={index} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Publish button / progress bar */}
        <div className={fadeClass(isTyping)}>
          {publishState === "idle" && (
            <Button
              onClick={handleSubmit}
              disabled={!enTitle || !bnTitle || !content}
              className="rounded-lg"
            >
              {editingPost ? "Update Post" : "Publish"}
            </Button>
          )}

          {publishState === "publishing" && (
            <Button
              onClick={handleSubmit}
              disabled={!enTitle || !bnTitle || !content}
              className="rounded-lg"
            >
              {<LoaderCircle size={24} className="animate-spin" />} publishing
            </Button>
          )}

          {publishState === "success" && (
            <div className="w-full h-10 bg-success rounded-sm flex items-center justify-center gap-2 text-success-foreground font-body font-semibold">
              <Check className="h-4 w-4" />
              {editingPost ? "Updated!" : "Published!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPost;
