import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import logo from "../../assets/logoLight.png";

const Verification = () => {
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

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [securityCode, setSecurityCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Requirement 5: verified = true (mock for now) console.log(securityCode)
    console.log("Verification Code:", securityCode);

    if (securityCode.length === 6) {
      setIsVerified(true);
      toast({
        title: "Code Verified",
        description: "Now you can set your new password.",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit code.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Passwords mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Error",
        description: "Email is missing. Please start the process again.",
        variant: "destructive",
      });
      navigate("/forgot-password");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/reset-password", {
        email,
        newPassword: passwords.newPassword,
      });

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Update Failed",
        description:
          error.response?.data?.message || "Failed to update password.",
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
              {isVerified ? "Reset Password" : "Verification"}
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              {isVerified
                ? "Enter your new password below."
                : "Enter the 6-digit code sent to your email."}
            </p>
          </div>

          {!isVerified ? (
            <form onSubmit={handleVerify} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="code">
                  Verification Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={handleUpdatePassword}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="newPassword">
                  New Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="****"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="****"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verification;
