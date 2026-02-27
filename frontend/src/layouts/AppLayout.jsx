import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  Settings,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import { useTranslation } from "../hooks/useTranslation";
import UserDropdown from "../components/UserDropdown";

const navItems = [
  { to: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/expenses", labelKey: "expenses", icon: CreditCard },
  { to: "/dashboard/analytics", labelKey: "analytics", icon: BarChart3 },
  { to: "/dashboard/settings", labelKey: "settings", icon: Settings },
];

const pageTitleKeys = {
  "/dashboard": "dashboard",
  "/dashboard/expenses": "expenses",
  "/dashboard/analytics": "analytics",
  "/dashboard/settings": "settings",
};

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, logoutLoading } = useAuth();
  const { theme, toggleTheme } = usePreferences();
  const t = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = t(pageTitleKeys[location.pathname] || "appName");

  const handleLogout = () => {
    logout(() => navigate("/login", { replace: true }));
  };

  const renderSidebar = (isMobile = false) => (
    <div
      className={`flex flex-col h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800/80 ${
        isMobile ? "w-72" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 h-16 shrink-0 border-b border-gray-200 dark:border-gray-800/80">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-sm">
            <Receipt className="w-4 h-4" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-[15px]">
            {t("appName")}
          </span>
        </div>
        {isMobile && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, labelKey, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800/80 dark:hover:text-gray-100"
              }`
            }
            onClick={() => isMobile && setMobileOpen(false)}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-2 pb-4 pt-2 border-t border-gray-200 dark:border-gray-800/80 shrink-0">
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {logoutLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin shrink-0" />
              <span>{t("loggingOut")}</span>
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4 shrink-0" />
              <span>{t("logout")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0">
        {renderSidebar(false)}
      </aside>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 flex lg:hidden transition-opacity duration-200 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
        <aside
          className={`relative z-50 h-full transition-transform duration-200 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {renderSidebar(true)}
        </aside>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Topbar */}
        <header className="relative z-50 h-16 shrink-0 border-b border-gray-200 dark:border-gray-800/80 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/80 transition-colors"
              aria-label="Toggle theme"
            >
              <span className="text-sm">{theme === "dark" ? "☀️" : "🌙"}</span>
            </button>

            <UserDropdown />
          </div>
        </header>

        <main className="flex-1 min-w-0 px-4 lg:px-6 py-6 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

