import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import { useTranslation } from "../hooks/useTranslation";

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

  return (
    <div className="max-w-2xl space-y-8">
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
    </div>
  );
};

export default Settings;
