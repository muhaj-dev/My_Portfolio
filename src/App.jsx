import React from 'react';
import { Routes, Route } from 'react-router-dom';

import PortfolioPage from './pages/PortfolioPage';
import LoginPage from './admin/pages/LoginPage';
import AdminLayout from './admin/components/AdminLayout';
import ProtectedRoute from './admin/components/ProtectedRoute';
import DashboardPage from './admin/pages/DashboardPage';
import AdminAbouts from './admin/pages/AdminAbouts';
import AdminWorks from './admin/pages/AdminWorks';
import AdminSkills from './admin/pages/AdminSkills';
import AdminExperiences from './admin/pages/AdminExperiences';
import AdminTestimonials from './admin/pages/AdminTestimonials';
import AdminBrands from './admin/pages/AdminBrands';
import AdminContacts from './admin/pages/AdminContacts';

import './App.scss';

const App = () => {
  return (
    <Routes>
      <Route path="/*" element={<PortfolioPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="abouts" element={<AdminAbouts />} />
        <Route path="works" element={<AdminWorks />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="experiences" element={<AdminExperiences />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="contacts" element={<AdminContacts />} />
      </Route>
    </Routes>
  );
};

export default App;
