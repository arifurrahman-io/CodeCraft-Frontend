import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import WebsiteRoutes from "@/routes/WebsiteRoutes";
import AdminRoutes from "@/routes/AdminRoutes";
import { AuthProvider } from "@/context/AuthContext";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/*" element={<WebsiteRoutes />} />
        </Routes>
        <Toaster position="bottom-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRoutes;
