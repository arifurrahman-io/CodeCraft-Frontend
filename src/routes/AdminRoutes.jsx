import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";
import LoginPage from "@/pages/admin/Login";
import DashboardPage from "@/pages/admin/Dashboard";
import ServiceListPage from "@/pages/admin/services/ServiceList";
import ServiceFormPage from "@/pages/admin/services/ServiceForm";
import ProjectListPage from "@/pages/admin/projects/ProjectList";
import ProjectFormPage from "@/pages/admin/projects/ProjectForm";
import BlogListPage from "@/pages/admin/blogs/BlogList";
import BlogFormPage from "@/pages/admin/blogs/BlogForm";
import TeamListPage from "@/pages/admin/team/TeamList";
import TeamFormPage from "@/pages/admin/team/TeamForm";
import TestimonialListPage from "@/pages/admin/testimonials/TestimonialList";
import TestimonialFormPage from "@/pages/admin/testimonials/TestimonialForm";
import MessageListPage from "@/pages/admin/messages/MessageList";
import MessageDetailsPage from "@/pages/admin/messages/MessageDetails";
import WebsiteSettingsPage from "@/pages/admin/settings/WebsiteSettings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="services" element={<ServiceListPage />} />
          <Route path="services/create" element={<ServiceFormPage />} />
          <Route path="services/edit/:id" element={<ServiceFormPage />} />
          <Route path="services/:id/edit" element={<ServiceFormPage />} />

          <Route path="projects" element={<ProjectListPage />} />
          <Route path="projects/create" element={<ProjectFormPage />} />
          <Route path="projects/edit/:id" element={<ProjectFormPage />} />
          <Route path="projects/:id/edit" element={<ProjectFormPage />} />

          <Route path="blogs" element={<BlogListPage />} />
          <Route path="blogs/create" element={<BlogFormPage />} />
          <Route path="blogs/edit/:id" element={<BlogFormPage />} />
          <Route path="blogs/:id/edit" element={<BlogFormPage />} />

          <Route path="team" element={<TeamListPage />} />
          <Route path="team/create" element={<TeamFormPage />} />
          <Route path="team/edit/:id" element={<TeamFormPage />} />
          <Route path="team/:id/edit" element={<TeamFormPage />} />

          <Route path="testimonials" element={<TestimonialListPage />} />
          <Route path="testimonials/create" element={<TestimonialFormPage />} />
          <Route path="testimonials/edit/:id" element={<TestimonialFormPage />} />
          <Route
            path="testimonials/:id/edit"
            element={<TestimonialFormPage />}
          />

          <Route path="messages" element={<MessageListPage />} />
          <Route path="messages/:id" element={<MessageDetailsPage />} />

          <Route path="settings" element={<WebsiteSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
