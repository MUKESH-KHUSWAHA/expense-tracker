import { Trash2, Pencil, Loader2 } from "lucide-react";
import { usePreferences } from "../context/PreferencesContext";
import { formatCurrency, formatDateShort } from "../utils/format";
import { useTranslation } from "../hooks/useTranslation";

const ExpenseTable = ({ expenses, onDelete, onEdit, deletingId }) => {
  const { currency, dateFormat } = usePreferences();
  const t = useTranslation();
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/80 shadow-sm">
      <table className="w-full min-w-[600px] text-sm">
        <thead className="bg-gray-50/80 dark:bg-gray-800/50">
          <tr>
            <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t("title")}
            </th>
            <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t("category")}
            </th>
            <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t("date")}
            </th>
            <th className="px-4 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t("amount")}
            </th>
            <th className="px-4 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
              {t("actions")}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200/80 dark:divide-gray-800/80">
          {expenses.map((e) => (
            <tr
              key={e._id}
              className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors"
            >
              <td className="px-4 py-3.5 font-medium text-gray-900 dark:text-white">
                {e.title}
              </td>
              <td className="px-4 py-3.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800/80 text-[11px] font-medium text-gray-700 dark:text-gray-300">
                  {e.category || t("uncategorized")}
                </span>
              </td>
              <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400">
                {formatDateShort(e.date || e.createdAt, dateFormat)}
              </td>
              <td className="px-4 py-3.5 text-right font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {formatCurrency(e.amount, currency)}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(e)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/40 transition-colors"
                    aria-label={t("edit")}
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    disabled={deletingId === e._id}
                    onClick={() => onDelete(e._id)}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                      deletingId === e._id
                        ? "text-red-400 dark:text-red-400"
                        : "text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/40"
                    }`}
                    aria-label={t("delete")}
                  >
                    {deletingId === e._id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;