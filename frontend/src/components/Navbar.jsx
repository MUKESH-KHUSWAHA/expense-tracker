import { NavLink } from "react-router-dom";
import { Sun, Moon, LayoutDashboard, Receipt } from "lucide-react";

const Navbar = ({ darkMode, onToggleDarkMode }) => {
  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive
        ? "bg-primary text-white"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <Receipt className="w-6 h-6 text-primary" />
              Expense Tracker
            </NavLink>
            <div className="flex gap-1">
              <NavLink to="/" end className={navLinkClass}>
                <span className="flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  Dashboard
                </span>
              </NavLink>
              <NavLink to="/expenses" className={navLinkClass}>
                <span className="flex items-center gap-2">
                  <Receipt size={18} />
                  Expenses
                </span>
              </NavLink>
            </div>
          </div>

          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
