import * as React from "react";
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  FolderOpen,
  // User,
  UserRoundPen,
  LogOut,
  // Settings,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import logo from "../assets/logoLight.png";
import icon from "../assets/icon.png";
import { toast } from "@/hooks/use-toast";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "New News", url: "/new-news", icon: FilePlus },
  { title: "All News", url: "/all-news", icon: FileText },
  { title: "Categories", url: "/categories", icon: FolderOpen },
  { title: "Authors", url: "/authors", icon: UserRoundPen },
  // { title: "Profile", url: "/profile", icon: User },
  // { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, setOpen, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  // Auto collapse sidebar on navigation
  React.useEffect(() => {
    // setOpen(false);
    setOpenMobile(false);
  }, [location.pathname, setOpenMobile]);

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border h-20 flex items-center justify-center">
        {!collapsed ? (
          <img src={logo} alt="Ekushey 71 Sangbad Logo" />
        ) : (
          <img
            src={icon}
            alt="Ekushey 71 Sangbad icon"
            className="w-full object-cover"
          />
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-body text-xs uppercase tracking-wider text-muted-foreground">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`flex items-center gap-4 px-4 py-3 font-body text-xl transition-colors border-l-[4px] ${
                          isActive
                            ? "border-primary text-primary font-bold bg-accent"
                            : "border-transparent text-foreground hover:bg-accent hover:text-foreground"
                        }`}
                        activeClassName=""
                      >
                        <item.icon className="h-7 w-7 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                        {collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4 flex flex-col">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <SidebarMenuButton
              asChild
              className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full cursor-pointer"
            >
              <div className="flex items-center gap-4 px-4 py-3 font-body text-lg rounded-sm">
                <LogOut className="h-6 w-6 shrink-0" />
                {!collapsed && <span>Log Out</span>}
              </div>
            </SidebarMenuButton>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will log you out of your Admin session. You will
                need to log back in to access the dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  localStorage.removeItem("adminToken");
                  sessionStorage.removeItem("adminToken");
                  localStorage.removeItem("adminUser");
                  sessionStorage.removeItem("adminUser");
                  toast({
                    title: "Logged Out",
                    description: "You have been successfully logged out.",
                  });
                  window.location.href = "/login";
                }}
              >
                Log Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {!collapsed && (
          <p className="text-xs text-muted-foreground font-body ml-3">
            © {new Date().getFullYear()} Ekushey 71 Sangbad
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
