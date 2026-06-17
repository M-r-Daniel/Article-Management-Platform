import { Footer } from './Footer';
import { Header } from './Header';

interface PageLayoutProps {
  children?: React.ReactNode;
}

/**
 * Standard layout wrapper for public reader app pages.
 */
export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">{children}</main>
      <Footer />
    </div>
  );
}
export default PageLayout;
