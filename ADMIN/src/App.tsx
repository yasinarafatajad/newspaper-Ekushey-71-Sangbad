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
import Authors from "./pages/Authors";
import NewsDetails from "./pages/NewsDetails";
import AuthorDetails from "./pages/AuthorDetails";
import Login from "./pages/auth/Login";
// import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Verification from "./pages/auth/Verification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signUp" element={<SignUp />} /> */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verification" element={<Verification />} />

          {/* Protected/Dashboard Routes */}
          <Route
            path="/*"
            element={
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/new-news" element={<NewPost />} />
                  <Route path="/edit-news/:id" element={<NewPost />} />
                  <Route path="/all-news" element={<AllPosts />} />
                  <Route path="/news/:id" element={<NewsDetails />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/authors" element={<Authors />} />
                  <Route path="/author/:id" element={<AuthorDetails />} />
                  {/* <Route path="/profile" element={<Profile />} /> */}
                  {/* <Route path="/settings" element={<SettingsPage />} /> */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </DashboardLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
