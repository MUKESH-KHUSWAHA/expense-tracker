import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";

const Landing = () => {
  const { isAuthenticated, loading } = useAuth();
  const [ctaLoading, setCtaLoading] = useState(false);
  const navigate = useNavigate();
  const t = useTranslation();

  const handleGetStarted = (e) => {
    e.preventDefault();
    setCtaLoading(true);
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 700);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <span className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col relative overflow-hidden">
      {/* Background visuals */}
      <div className="gradient-blob gradient-blob-1" aria-hidden="true" />
      <div className="gradient-blob gradient-blob-2" aria-hidden="true" />

      <header className="relative z-10 border-b border-gray-200 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="font-semibold text-gray-900 dark:text-white">
            {t("appName")}
          </span>
          <Link
            to="/login"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {t("signIn")}
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center animate-hero-fade">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t("heroHeadline")}
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            {t("heroSubhead")}
          </p>
          <div className="mt-10">
            <button
              type="button"
              onClick={handleGetStarted}
              disabled={ctaLoading}
              className="px-8 py-4 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center gap-2"
            >
              {ctaLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("loading")}
                </>
              ) : (
                t("getStarted")
              )}
            </button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 border-t border-gray-200 dark:border-gray-800/80 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("appName")}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Built by Mukesh Kumar
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
