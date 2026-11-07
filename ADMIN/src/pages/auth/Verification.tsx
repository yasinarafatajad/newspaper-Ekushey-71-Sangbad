import { useEffect, useState } from "react";

const RESEND_COOLDOWN_SECONDS = 30;
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import logo from "../../assets/logoLight.png";

const Verification = () => {
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
  const [isResending, setIsResending] = useState(false);
  // A code was just sent from the previous step, so the cooldown starts on load.
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Error",
        description: "Email is missing. Please start the process again.",
        variant: "destructive",
      });
      navigate("/forgot-password");
      return;
    }

    if (securityCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/verify-reset-code", { email, code: securityCode });

      setIsVerified(true);
      toast({
        title: "Code Verified",
        description: "Now you can set your new password.",
      });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Verification Failed",
        description: err.response?.data?.message || "Invalid or expired code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
      await api.post("/reset-password-by-code", {
        email,
        code: securityCode,
        newPassword: passwords.newPassword,
      });

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      navigate("/login");
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Update Failed",
        description: err.response?.data?.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email is missing. Please start the process again.",
        variant: "destructive",
      });
      navigate("/forgot-password");
      return;
    }

    setIsResending(true);
    try {
      const identifier = String(email).trim();
      // The server checks by email or phone and always sends the code by email.
      const res = await api.post(
        "/forgot-password",
        identifier.includes("@") ? { email: identifier } : { phone: identifier },
      );

      setSecurityCode("");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      toast({
        title: "New code sent",
        description:
          res.data?.message ||
          "Please check your email for the new verification code.",
      });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Unable to resend code",
        description:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
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

              <div className="text-center text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading || isResending || resendCooldown > 0}
                  className="text-primary hover:underline font-semibold disabled:opacity-60 disabled:no-underline"
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : isResending
                      ? "Resending..."
                      : "Resend code"}
                </button>
              </div>
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
