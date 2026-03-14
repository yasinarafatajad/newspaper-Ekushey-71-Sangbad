import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Shield, User } from "lucide-react";
import { Navigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const token =
    localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
  const userStr =
    localStorage.getItem("adminUser") || sessionStorage.getItem("adminUser");
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error("Failed to parse user data", e);
    }
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-20 flex items-center justify-between border-b border-border bg-background sticky top-0 z-10 pr-4">
            <div className="flex items-center">
              <SidebarTrigger className="ml-3" />
            </div>

            {user && (
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold font-heading">
                    {user.name}
                  </span>
                  {user.title && (
                    <span className="text-xs text-muted-foreground font-body leading-none">
                      {user.title}
                    </span>
                  )}
                </div>
                {user.src ? (
                  <img
                    src={user.src}
                    alt={user.name}
                    className="h-12  w-12   rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                    <User size={20} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            )}
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
