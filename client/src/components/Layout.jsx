import { Home, User, LogOut, Dumbbell, PlusSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavItem = ({ to, icon, label }) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 p-3 rounded-full hover:bg-spotter-dark transition-colors w-fit xl:w-full"
    >
      {/* Icon */}
      <div className="w-7 h-7">{icon}</div>
      {/* Text (Visible only on large screens) */}
      <span className="hidden xl:block text-xl font-normal">{label}</span>
    </Link>
  );
};

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-spotter-base flex justify-center">
      <div className="w-full max-w-7xl flex">
        {/* LEFT SIDEBAR (Navigation) */}
        {/* Hidden on mobile, Block on screens sm and above */}
        <nav className="w-20 xl:w-[275px] h-screen sticky top-0 flex flex-col border-r border-spotter-border px-2 py-4">
          <Link
            to="/"
            className="p-3 mb-4 rounded-full w-fit hover:bg-spotter-dark transition-colors"
          >
            <Dumbbell className="w-8 h-8 text-spotter-text" />
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-col gap-2 flex-1">
            <NavItem to="/" icon={<Home />} label="Home" />
            <NavItem to="/profile" icon={<User />} label="Profile" />

            {/* POST Button (Icon only on small screens, Text on large screens) */}
            <button className="mt-4 bg-spotter-blue hover:bg-spotter-blueHover text-white p-3 xl:py-3 xl:px-8 rounded-full font-bold shadow-lg transition-all flex justify-center items-center w-fit xl:w-full">
              <PlusSquare className="xl:hidden w-7 h-7" />
              <span className="hidden xl:block">Post</span>
            </button>
          </div>

          {/* Logout Button (At the bottom) */}
          <button className="p-3 flex items-center gap-4 rounded-full hover:bg-spotter-dark transition-colors mb-4">
            <LogOut className="w-6 h-6" />
            <div className="hidden xl:block text-left">
              <p className="font-bold text-sm">Log Out</p>
              <p className="text-spotter-textGray text-xs">@user</p>
            </div>
          </button>
        </nav>

        {/* Feed */}
        <main className="flex-1 min-w-0 border-r border-spotter-border">
          {children}
        </main>

        {/* Widgets */}
        {/* Visible only on large screens (lg) */}
        <aside className="hidden lg:block w-[350px] pl-8 py-4 h-screen sticky top-0">
          <div className="bg-spotter-dark rounded-xl p-4 sticky top-4">
            <h2 className="font-bold text-xl mb-4">Who to follow</h2>
            {/* Suggestions will be fetched from the backend later */}
            <div className="text-spotter-textGray text-sm">
              Loading suggestions...
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
