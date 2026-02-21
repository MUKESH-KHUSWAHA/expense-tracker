import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import { getExpenses } from "../services/expenseApi";
import { formatCurrency, formatAmountOnly, formatDateShort } from "../utils/format";
import { convertInrToDisplay } from "../utils/currencyUtils";
import { useTranslation } from "../hooks/useTranslation";
import { IndianRupee, FileText } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const { currency, dateFormat } = usePreferences();
  const t = useTranslation();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const { cards, dayData, recent } = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let totalAmount = 0;
    let monthlyAmount = 0;
    const byDay = new Map();

    expenses.forEach((e) => {
      const amount = Number(e.amount) || 0;
      if (amount <= 0) return;
      totalAmount += amount;
      const rawDate = e.date || e.createdAt;
      const d = rawDate ? new Date(rawDate) : null;
      if (d >= startOfMonth && d <= now) monthlyAmount += amount;
      const key = d
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
        : null;
      if (key) byDay.set(key, (byDay.get(key) || 0) + amount);
    });

    const totalEntries = expenses.length;
    const cards = [
      { label: "totalExpense", value: formatCurrency(totalAmount, currency), icon: IndianRupee },
      { label: "thisMonth", value: formatCurrency(monthlyAmount, currency), icon: IndianRupee },
      { label: "expenseCount", value: totalEntries, icon: FileText },
    ];

    const dayData = Array.from(byDay.entries())
      .filter(([key]) => key != null)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([key, total]) => {
        const [year, month, day] = key.split("-");
        const label = new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
        ).toLocaleString("default", { day: "numeric", month: "short" });
        return { name: label, total: convertInrToDisplay(total, currency) };
      });

    return {
      cards,
      dayData,
      recent: expenses.slice(0, 5),
    };
  }, [expenses, currency]);

  const latestCategory = expenses.length > 0 ? expenses[0].category : "-";
  const isLoading = authLoading || loading;
  const showError = Boolean(error);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-500 dark:text-gray-400">{t("loading")}</p>
        </div>
      ) : showError ? (
        <div className="flex items-center justify-center py-24 text-red-500 dark:text-red-400">
          {error}
        </div>
      ) : (
    <div className="space-y-8">
      <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="group bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-gray-300/80 dark:hover:border-gray-700/80 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t(label)}
              </span>
              <Icon className="w-4 h-4 text-indigo-500/80 dark:text-indigo-400/80 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            </div>
            <div className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {value}
            </div>
            {label === "expenseCount" && (
              <div className="text-xs text-gray-500 dark:text-gray-400 pt-0.5">
                {t("latest")}:{" "}
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium">
                  {latestCategory}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-6 lg:col-span-2 shadow-sm">
          <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-5">
            {t("dailyTrend")}
          </h2>
          <div className="w-full" style={{ height: 300, minHeight: 300 }}>
            {dayData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                {t("noDataAvailable")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value) => formatAmountOnly(value, currency)}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
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

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800/80 rounded-xl p-6 shadow-sm">
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              {t("recentExpenses")}
            </h2>
            <div className="space-y-3 text-sm">
              {recent.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("noExpensesYet")}
                </p>
              ) : (
                recent.map((e) => (
                  <div
                    key={e._id}
                    className="flex items-center justify-between gap-3 py-1"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900 dark:text-white">
                        {e.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800/80 text-[11px]">
                          {e.category || t("uncategorized")}
                        </span>
                        <span>{formatDateShort(e.date || e.createdAt, dateFormat)}</span>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">
                      {formatCurrency(e.amount, currency)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default Dashboard;
