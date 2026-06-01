import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../../widgets/layout/MainLayout';
import { RoleRoute } from '../../shared/lib/RoleRoute';
import { HomePage } from '../../pages/home/HomePage';
import { LoginPage } from '../../pages/auth/login/LoginPage';
import { RegisterPage } from '../../pages/auth/register/RegisterPage';
import { ProfilePage } from '../../pages/profile/ProfilePage';
import { CourseCatalogPage } from '../../pages/courses/CourseCatalogPage';
import { CoursePage } from '../../pages/courses/CoursePage';
import { LessonPage } from '../../pages/lessons/LessonPage';
import { TasksCatalogPage } from '../../pages/tasks/TasksCatalogPage';
import { TaskPage } from '../../pages/tasks/TaskPage';
import { AnalysisPage } from '../../pages/analysis/AnalysisPage';
import { TrainerStudentGamesPage } from '../../pages/trainer/TrainerStudentGamesPage';
import { ROUTES } from '../../shared/constants/routes';

export const RouterProvider = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<RoleRoute requireAuth />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="/my-courses" element={<Navigate to={ROUTES.PROFILE} replace />} />
        <Route path="/trainer/assign" element={<Navigate to={ROUTES.PROFILE} replace />} />

        <Route element={<RoleRoute requireAuth roles={['trainer']} />}>
          <Route path="/trainer/students/:studentId/games" element={<TrainerStudentGamesPage />} />
        </Route>

        <Route path="/courses" element={<CourseCatalogPage />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
        <Route path="/tasks" element={<TasksCatalogPage />} />
        <Route path="/tasks/:id" element={<TaskPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/analysis/:gameId" element={<AnalysisPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
