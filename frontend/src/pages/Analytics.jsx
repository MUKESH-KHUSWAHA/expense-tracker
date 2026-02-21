import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import { useTranslation } from "../hooks/useTranslation";
import { getExpenses } from "../services/expenseApi";
import { convertInrToDisplay } from "../utils/currencyUtils";
import { formatCurrency, formatAmountOnly, formatDateShort } from "../utils/format";
import {
  filterExpensesByRange,
  getDaysInRange,
  RANGE_KEYS,
} from "../utils/analyticsDates";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const CHART_HEIGHT = 280;
const RANGE_OPTIONS = [
  { value: RANGE_KEYS.ALL, labelKey: "allTime" },
  { value: RANGE_KEYS.LAST_7, labelKey: "last7Days" },
  { value: RANGE_KEYS.LAST_30, labelKey: "last30Days" },
  { value: RANGE_KEYS.THIS_MONTH, labelKey: "thisMonth" },
];

const Analytics = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const { currency, dateFormat } = usePreferences();
  const t = useTranslation();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState(RANGE_KEYS.ALL);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    const fetchExpenses = async () => {
      try {
        const res = await getExpenses();
        setExpenses(res.data.data || []);
      } catch {
        setError(t("failedToLoad"));
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [authLoading, isAuthenticated, t]);

  const filteredExpenses = useMemo(
    () => filterExpensesByRange(expenses, dateRange),
    [expenses, dateRange],
  );

  const { dayData, totalInr, avgDailyInr } = useMemo(() => {
    const byDayMap = new Map();
    let totalInr = 0;

    filteredExpenses.forEach((e) => {
      const amount = Number(e.amount) || 0;
      if (amount <= 0) return;
      totalInr += amount;
      const rawDate = e.date || e.createdAt;
      const d = rawDate ? new Date(rawDate) : null;
      const key = d
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
        : null;
      if (key) byDayMap.set(key, (byDayMap.get(key) || 0) + amount);
    });

    const dayEntries = Array.from(byDayMap.entries())
      .filter(([key]) => key != null)
      .sort(([a], [b]) => (a > b ? 1 : -1));

    const dayData = dayEntries.map(([key, total]) => {
      const [year, month, day] = key.split("-");
      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
      const label = dateObj.toLocaleString("default", { day: "numeric", month: "short" });
      return {
        name: label,
        dateKey: key,
        dateObj,
        total: convertInrToDisplay(total, currency),
      };
    });

    const daysInRange = getDaysInRange(dateRange);
    const avgDailyInr = daysInRange > 0 ? totalInr / daysInRange : 0;

    return { dayData, totalInr, avgDailyInr };
  }, [filteredExpenses, currency, dateRange]);

  const isLoading = authLoading || loading;
  const showError = Boolean(error);
  const hasData = filteredExpenses.length > 0;
  const hasChartData = dayData.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="h-10 w-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{t("loadingAnalytics")}</p>
        </div>
      ) : showError ? (
        <div className="flex items-center justify-center py-24 text-red-500 dark:text-red-400">
          {error}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("dateRange")}
            </span>
            <div className="flex flex-wrap gap-2">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDateRange(opt.value)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    dateRange === opt.value
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/80 p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t("totalSpent")}
              </p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                {hasData ? formatCurrency(totalInr, currency) : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/80 p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t("averageDailySpend")}
              </p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                {hasData ? formatCurrency(avgDailyInr, currency) : "—"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/80 p-4 sm:p-6 shadow-sm">
            <h2 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              {t("dailyTrend")}
            </h2>
            <div
              className="w-full min-w-0"
              style={{ height: CHART_HEIGHT, minHeight: CHART_HEIGHT }}
            >
              {!hasChartData ? (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                  {t("noDataAvailable")}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dayData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        const item = payload[0];
                        const raw = dayData.find((d) => d.name === label);
                        const dateStr = raw?.dateObj
                          ? formatDateShort(raw.dateObj.toISOString(), dateFormat)
                          : label;
                        return (
                          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 shadow-sm text-sm">
                            <p className="font-medium text-gray-900 dark:text-white">{t("date")}: {dateStr}</p>
                            <p className="text-gray-700 dark:text-gray-300">
                              {t("amount")}: {formatAmountOnly(item.value, currency)}
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Bar
                      dataKey="total"
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                      isAnimationActive
                      animationDuration={400}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
