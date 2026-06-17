import { Navigate, Route, Routes } from 'react-router';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ArticlesListPage } from './pages/ArticlesListPage';
import { CreateArticlePage } from './pages/CreateArticlePage';
import { DashboardPage } from './pages/DashboardPage';
import { EditArticlePage } from './pages/EditArticlePage';
import { LoginPage } from './pages/LoginPage';

/**
 * Root Admin App component containing routing structure.
 * Protected routes are wrapped in ProtectedRoute and AppLayout.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Unprotected Login path */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard endpoints */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/articles" element={<ArticlesListPage />} />
            <Route path="/articles/create" element={<CreateArticlePage />} />
            <Route path="/articles/edit/:id" element={<EditArticlePage />} />
          </Route>
        </Route>

        {/* Redirect unknown routes back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
