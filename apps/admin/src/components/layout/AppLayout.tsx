import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';

/**
 * Main dashboard layout wrapper. Links Sidebar to main content area
 * with appropriate spacing.
 */
export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg-dark)]">
      {/* Fixed left sidebar panel */}
      <Sidebar />

      {/* Scrolling right content panel */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
export default AppLayout;
