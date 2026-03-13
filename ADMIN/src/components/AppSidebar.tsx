import {
  LayoutDashboard,
  FilePlus,
  FileText,
  FolderOpen,
  User,
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
import logo from "../assets/logoLight.png";
import icon from "../assets/icon.png";

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
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border ">
        {!collapsed ? (
          <img src={logo} alt="Ekushey 71 Sangbad Logo" />
        ) : (
          <img
            src={icon}
            alt="Ekushey 71 Sangbad icon"
            className="w-full h-full scale-150"
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
                        className={`flex items-center gap-3 px-3 py-2 font-body text-sm transition-colors border-l-[3px] ${
                          isActive
                            ? "border-primary text-primary font-semibold bg-accent"
                            : "border-transparent text-foreground hover:bg-accent hover:text-foreground"
                        }`}
                        activeClassName=""
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4 flex flex-col gap-2">
        <SidebarMenuButton
          asChild
          className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full cursor-pointer"
        >
          <div
            onClick={() => console.log("logout")}
            className="flex items-center gap-3 px-3 py-2 font-body text-sm rounded-sm"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </div>
        </SidebarMenuButton>
        {!collapsed && (
          <p className="text-xs text-muted-foreground font-body text-center mt-2">
            © {new Date().getFullYear()} Ekushey 71 Sangbad
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
