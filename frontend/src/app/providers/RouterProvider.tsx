import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '../../pages/home/HomePage';
import { LoginPage } from '../../pages/auth/login/LoginPage';
import { RegisterPage } from '../../pages/auth/register/RegisterPage';
import { ProfilePage } from '../../pages/profile/ProfilePage';

export const RouterProvider = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  </BrowserRouter>
);