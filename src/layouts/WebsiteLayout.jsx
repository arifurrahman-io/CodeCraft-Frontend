import { Outlet } from "react-router-dom";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";

const WebsiteLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default WebsiteLayout;
