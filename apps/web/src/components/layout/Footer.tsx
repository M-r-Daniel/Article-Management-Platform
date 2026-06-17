/**
 * Footer panel with copyright and platform notes.
 */
export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-dark)] py-8 mt-20 bg-slate-950/20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
        <p>&copy; {new Date().getFullYear()} Publisher. All rights reserved.</p>
        <div className="flex gap-4">
          <span>Built with Bun, Hono, and React</span>
          <span>&bull;</span>
          <span>Job Application Demo</span>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
