import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import AboutSection from "./pages/About";
import BlogSection from "./pages/approach_pages/Blog";
import BlogPage from "./pages/BlogPage";
import Faq from "./pages/approach_pages/Faq";
import Pricing from "./pages/approach_pages/Pricing";
import Contact from "./pages/approach_pages/Contact";
import NotFound from "./components/NotFound";
import ProductPage from "./pages/Product";
import CartPage from "./pages/CartPage";
import { Toaster } from "sonner";
import ResetPassword from "./pages/ResetPassword";
import MainLayout from "./MainLayout";
import ProfilePage from "./components/ProfilePage";
import OrderPage from "./components/OrderPage";
import HatmaPrime from "./pages/Hatmaprime";
import DigitalMarketing from "./pages/MarketingServices";
import CACRegisteration from "./pages/CACRegisteration";
import Design from "./pages/Design";
import BrandDevelopment from "./pages/BrandDevelopment";
import AdminDashboardLayout from "./pages/admin/AdminDashboardLayout";
import Overview from "./pages/admin/Overview";
import PostsDashboard from "./pages/admin/Posts";
import AddPostForm from "./pages/admin/AddPost";
import ProductDashboard from "./pages/admin/Product";
import Sales from "./pages/admin/Sales";
import Forms from "./pages/admin/Forms&Orders";
import PortfolioDashboard from "./pages/admin/Portfolio";
import Analytics from "./pages/admin/Analytics";
import OurWork from "./components/ourWork";
import { initTracking } from "./utils/trackEvent";
import useAuthStore from "./store/useAuthStore";
import ProtectedRoute from "./utils/ProtectedRoute";
import Unauthorized from "./components/Unautorized";
import { useEffect } from "react";


const App = () => {

  useEffect(() => {
  const checkTokenExpiration = () => {
    const { accessToken, logout } = useAuthStore.getState();
    if (accessToken) {
      const decoded = jwt.decode(accessToken);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
      }
    }
  };
  
  // Check every 5 minutes
  const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);
  return () => clearInterval(interval);
}, []);

useEffect(() => {
  const { accessToken, refreshToken } = useAuthStore.getState();
  if (!accessToken) {
    refreshToken();
  }
}, []);
  
initTracking();
  return (
    <>
      <Toaster richColors position="top-right" />
      <Router>
        <Routes>
          {/* Auth-related routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />


          {/* Protected routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>  
            <Route path="/admin" element={<AdminDashboardLayout />}>
              <Route index element={<Overview />}/>
              <Route path="products" element={<ProductDashboard />}/>
              <Route path="blog" element={<PostsDashboard />}/>
              <Route path="add-blog" element={<AddPostForm />}/>
              <Route path="sales" element={<Sales />} />
              <Route path="orders" element={<Forms />} />
              <Route path="info" element={<PortfolioDashboard />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
            </Route>


          {/* Public routes with layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<AboutSection />} />
            <Route path="/blog" element={<BlogSection />} />
            <Route path="/blog/:id" element={<BlogPage />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/work" element={<OurWork />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services/hatma-prime" element={<HatmaPrime />} />
            <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
            <Route path="/services/cac-registration" element={<CACRegisteration />} />
            <Route path="/services/branding" element={<Design/>} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/services/brand-development" element={<BrandDevelopment />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/cart" element={<CartPage />} />
            </Route>
            <Route path="/order/:id" element={<OrderPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
