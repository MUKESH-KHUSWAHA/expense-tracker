import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import { useTranslation } from "../hooks/useTranslation";
import { useEffect, useState } from "react";
import Toast from "../components/ui/Toast";
import { changePassword } from "../services/userApi";

const CURRENCIES = [
  { value: "INR", label: "₹ Indian Rupee" },
  { value: "USD", label: "$ US Dollar" },
  { value: "EUR", label: "€ Euro" },
];

const DATE_FORMATS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी (Hindi)" },
];

const Settings = () => {
  const { user } = useAuth();
  const t = useTranslation();
  const {
    theme,
    setTheme,
    currency,
    setCurrency,
    dateFormat,
    setDateFormat,
    language,
    setLanguage,
  } = usePreferences();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSubmitting, setPwSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    if (!toast.message) return;
    const id = setTimeout(() => setToast({ message: "", type: "success" }), 3000);
    return () => clearTimeout(id);
  }, [toast.message]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwSubmitting) return;

    if (newPassword.length < 6) {
      setToast({ message: "New password must be at least 6 characters", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ message: "Passwords do not match", type: "error" });
      return;
    }
    if (oldPassword === newPassword) {
      setToast({ message: "New password must be different from old password", type: "error" });
      return;
    }

    try {
      setPwSubmitting(true);
      const res = await changePassword(oldPassword, newPassword);
      if (res.data?.success) {
        setToast({ message: res.data?.message || "Password updated successfully", type: "success" });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setToast({ message: res.data?.message || "Failed to update password", type: "error" });
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Failed to update password", type: "error" });
    } finally {
      setPwSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
      <section className="bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-6 shadow-sm">
        <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          {t("profile")}
        </h2>
        <dl className="space-y-4">
          <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t("name")}
            </dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.name || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t("email")}
            </dt>
            <dd className="text-sm text-gray-700 dark:text-gray-300">
              {user?.email || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t("role")}
            </dt>
            <dd className="text-sm text-gray-700 dark:text-gray-300">
              {t("personalFinanceUser")}
            </dd>
          </div>
        </dl>
      </section>

      <section className="bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-6 shadow-sm">
        <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          {t("preferences")}
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("theme")}
            </label>
            <div className="flex gap-2">
              {["light", "dark"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTheme(opt)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === opt
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {opt === "light" ? t("light") : t("dark")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("currency")}
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full max-w-xs px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("dateFormat")}
            </label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full max-w-xs px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {DATE_FORMATS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("language")}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full max-w-xs px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-6 shadow-sm">
        <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Change password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Old password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm new password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={pwSubmitting}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {pwSubmitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Settings;
