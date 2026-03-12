import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import NewPost from "./pages/NewPost";
import AllPosts from "./pages/AllPosts";
import Categories from "./pages/Categories";
// import Profile from "./pages/Profile";
// import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new-post" element={<NewPost />} />
            <Route path="/edit-post/:id" element={<NewPost />} />
            <Route path="/all-posts" element={<AllPosts />} />
            <Route path="/categories" element={<Categories />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
            {/* <Route path="/settings" element={<SettingsPage />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
