import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import logo from "../../assets/logoLight.png";
import api from "@/lib/api";

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    title: "",
    location: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoLocal, setPhotoLocal] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      setPhotoLocal(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPhotoLocal(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
      return json.secure_url || null;
    } catch (err) {
      console.error("Image upload failed", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.title.trim() ||
      !form.location.trim() ||
      !form.email.trim() ||
      !form.username.trim() ||
      !form.password
    ) {
      toast({
        title: "তথ্য অসম্পূর্ণ",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    if (!photoLocal) {
      toast({
        title: "ছবি প্রয়োজন",
        description: "লেখকের ছবি আপলোড করুন।",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const src = await uploadToCloudinary();
      if (!src) {
        toast({
          title: "ছবি আপলোড ব্যর্থ",
          description: "ছবি আপলোড করা যায়নি।",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      const res = await api.post("/signup", {
        name: form.name,
        title: form.title,
        location: form.location,
        email: form.email,
        username: form.username,
        password: form.password,
        src,
      });
      if (res.status !== 200 && res.status !== 201)
        throw new Error("Server failed");
      toast({
        title: "Account Created",
        description: `"${form.name}", you can now log in.`,
      });
      // Clear form
      setForm({
        name: "",
        title: "",
        location: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
      removeImage();
      navigate("/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast({
        title: "Error creating account",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" flex items-center justify-center bg-background lg:p-4 lg:py-12">
      <div className="min-h-screen flex items-center justify-center w-full lg:max-w-xl bg-card border border-border rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 w-full h-full">
          <div className="flex flex-col items-center justify-center mb-8 gap-4">
            <img
              src={logo}
              alt="Ekushey 71 Sangbad"
              className="h-12 object-contain"
            />
            <h1 className="text-2xl font-bold font-heading text-center">
              Create Admin Account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Your Name"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">
                  Title / Designation{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Senior Reporter"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="location">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Dhaka"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@gmail.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>
                Author Photo (recommended square size){" "}
                <span className="text-destructive">*</span>
              </Label>
              {photoPreview ? (
                <div className="relative border border-border rounded-sm overflow-hidden">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background h-7 w-7 rounded-sm"
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
                  <span className="text-sm">ছবি আপলোড করুন (max 10 MB)</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required={!photoPreview}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="username">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="admin123"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="****"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="****"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading & Creating..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-semibold"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
