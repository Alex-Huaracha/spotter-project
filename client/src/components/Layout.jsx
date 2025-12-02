import { Navbar } from './Navbar';
import { WhoToFollow } from './WhoToFollow';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-spotter-base flex justify-center">
      <div className="w-full max-w-7xl flex">
        {/* LEFT SIDEBAR (Navigation) */}
        <Navbar />

        {/* Feed */}
        <main className="flex-1 min-w-0 border-r border-spotter-border">
          {children}
        </main>

        {/* Widgets */}
        {/* Visible only on large screens (lg) */}
        <aside className="hidden lg:block w-[350px] pl-8 py-4 h-screen sticky top-0">
          <WhoToFollow />

          {/* Small Footer */}
          <div className="mt-6 text-xs text-spotter-textGray px-4">
            <p>© 2025 Spotter Project</p>
            <p>Developed by Alex Huarcha</p>
          </div>
        </aside>
      </div>
    </div>
  );
};
