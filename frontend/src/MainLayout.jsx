import { Suspense, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import Footer from './components/Footer'

const MainLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
    <Navbar />
    <Suspense fallback={<LoadingSpinner />}>
      <main className="flex-grow">
        <Outlet />
      </main>
    </Suspense>
    <Footer />
  </div>
  );
};

export default MainLayout;