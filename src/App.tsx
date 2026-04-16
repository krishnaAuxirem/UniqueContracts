import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Features = lazy(() => import("./pages/Features"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

// Dashboard
const DashboardLayout = lazy(() => import("./components/layout/DashboardLayout"));
const CreatorDashboard = lazy(() => import("./pages/dashboard/CreatorDashboard"));
const BrandDashboard = lazy(() => import("./pages/dashboard/BrandDashboard"));
const AnalystDashboard = lazy(() => import("./pages/dashboard/AnalystDashboard"));
const AdminDashboard = lazy(() => import("./pages/dashboard/AdminDashboard"));
const Contracts = lazy(() => import("./pages/dashboard/Contracts"));
const ContractEditor = lazy(() => import("./pages/dashboard/ContractEditor"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const Notifications = lazy(() => import("./pages/dashboard/Notifications"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#CF6DFC] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/features" element={<Features />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="creator" element={<CreatorDashboard />} />
              <Route path="brand" element={<BrandDashboard />} />
              <Route path="analyst" element={<AnalystDashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="contracts" element={<Contracts />} />
              <Route path="editor" element={<ContractEditor />} />
              <Route path="editor/:id" element={<ContractEditor />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
