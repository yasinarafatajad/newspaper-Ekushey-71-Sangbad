import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import logo from "../../assets/logoLight.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // check login session
  const token = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
  const userStr = localStorage.getItem("adminUser") || sessionStorage.getItem("adminUser");
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error("Failed to parse user data", e);
    }
  }

  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const identifier = email.trim();
      // The server checks the account by email or phone, then emails the code.
      const res = await api.post(
        "/forgot-password",
        identifier.includes("@") ? { email: identifier } : { phone: identifier },
      );

      toast({
        title: "Verification code sent",
        description:
          res.data?.message ||
          "Please check your email for the verification code.",
      });

      navigate("/verification", { state: { email: identifier } });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      // Show it next to the field as well, so a failed request is never silent.
      setErrorMessage(message);
      toast({
        title: "Unable to send code",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-background lg:p-4">
      <div className="min-h-screen flex items-center justify-center w-full max-w-md bg-card border border-border rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 w-full h-full">
          <div className="flex flex-col items-center justify-center mb-8 gap-4">
            <img
              src={logo}
              alt="Ekushey 71 Sangbad"
              className="h-12 object-contain"
            />
            <h1 className="text-2xl font-bold font-heading text-center">
              Forgot Password
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Enter your email, phone number or username to receive a verification code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">
                Email, Phone Number or Username{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="admin@example.com, 01XXXXXXXXX or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errorMessage && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Verification Code"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-semibold"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
