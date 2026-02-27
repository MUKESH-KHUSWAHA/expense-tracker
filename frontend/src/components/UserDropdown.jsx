import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";

const UserDropdown = () => {
  const { user, logout, logoutLoading } = useAuth();
  const t = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout(() => navigate("/login", { replace: true }));
    setOpen(false);
  };

  const handleSettings = () => {
    navigate("/dashboard/settings");
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 pl-2 border-l border-gray-200 dark:border-gray-800 rounded-r-lg py-1 pr-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.name || "User"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email || ""}
          </span>
        </div>
        <div className="h-9 w-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold shadow-sm shrink-0">
          {(user?.name || "U").slice(0, 2).toUpperCase()}
        </div>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg py-2 z-[9999] origin-top-right transition ease-out duration-150 animate-dropdown-in"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {user?.email || ""}
            </p>
          </div>
          <div className="py-1">
            <button
              type="button"
              onClick={handleSettings}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
              role="menuitem"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              {t("settings")}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutLoading}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              role="menuitem"
            >
              {logoutLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  {t("loggingOut")}
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  {t("logout")}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
