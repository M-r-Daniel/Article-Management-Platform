import { Route, Routes } from 'react-router';
import { PageLayout } from './components/layout/PageLayout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * Public Reader app router. Wraps pages inside PageLayout and ErrorBoundary.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <PageLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PageLayout>
    </ErrorBoundary>
  );
}
