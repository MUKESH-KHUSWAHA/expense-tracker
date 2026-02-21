import { Trash2, Pencil, Loader2 } from "lucide-react";
import { usePreferences } from "../context/PreferencesContext";
import { formatCurrency, formatDateShort } from "../utils/format";
import { useTranslation } from "../hooks/useTranslation";

const ExpenseCards = ({ expenses, onDelete, onEdit, deletingId }) => {
  const { currency, dateFormat } = usePreferences();
  const t = useTranslation();
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {expenses.map((e) => (
        <div
          key={e._id}
          className="group bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800/80 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300/80 dark:hover:border-gray-700/80 transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {e.title}
              </h3>
              <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800/80 text-[11px] font-medium">
                  {e.category || t("uncategorized")}
                </span>
                <span>{formatDateShort(e.date || e.createdAt, dateFormat)}</span>
              </div>
            </div>
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 shrink-0 tabular-nums">
              {formatCurrency(e.amount, currency)}
            </p>
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/80">
            <button
              onClick={() => onEdit(e)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/40 transition-colors"
              aria-label={t("edit")}
            >
              <Pencil size={16} />
            </button>

            <button
              disabled={deletingId === e._id}
              onClick={() => onDelete(e._id)}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                deletingId === e._id
                  ? "bg-red-100 text-red-400 dark:bg-red-950/40 dark:text-red-400"
                  : "text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/40"
              }`}
              aria-label={t("delete")}
            >
              {deletingId === e._id ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseCards;