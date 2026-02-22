import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import {
  getExpenses,
  deleteExpense,
  createExpense,
  updateExpense,
} from "../services/expenseApi";
import { LayoutGrid, Table, Search } from "lucide-react";
import ExpenseCards from "../components/ExpenseCard";
import ExpenseTable from "../components/ExpenseTable";
import AddExpenseModal from "../components/AddExpenseModal";
import EditExpenseModal from "../components/EditExpenseModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import TopNotification from "../components/ui/TopNotification";

const PAGE_SIZE = 6;

const Expenses = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const t = useTranslation();
  const [expenses, setExpenses] = useState([]);
  const [view, setView] = useState("card");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (authLoading || !isAuthenticated || hasFetched.current) return;
    hasFetched.current = true;
    fetchExpenses();
  }, [authLoading, isAuthenticated]);

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

  const toggleView = () => {
    setView((prev) => (prev === "card" ? "table" : "card"));
  };

  const showNotification = (message, isError = false) => {
    setNotification(message);
    setTimeout(() => setNotification(""), isError ? 2000 : 1250);
  };

  const requestDelete = (id) => {
    setPendingDeleteId(id);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      setDeletingId(id);
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
      showNotification(t("expenseDeleted"));
    } catch {
      showNotification(t("failedToDelete"), true);
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  const handleCreateExpense = async (data) => {
    try {
      const res = await createExpense(data);
      setExpenses((prev) => [res.data.data, ...prev]);
      setShowModal(false);
      showNotification(t("expenseAdded"));
    } catch {
      showNotification(t("failedToCreate"), true);
    }
  };

  const handleUpdateExpense = async (id, data) => {
    try {
      setUpdating(true);
      const res = await updateExpense(id, data);
      setExpenses((prev) =>
        prev.map((e) => (e._id === id ? res.data.data : e)),
      );
      setEditExpense(null);
      showNotification(t("expenseUpdated"));
    } catch {
      showNotification(t("failedToUpdate"), true);
    } finally {
      setUpdating(false);
    }
  };

  const categories = Array.from(
    new Set(expenses.map((e) => e.category).filter(Boolean)),
  );

  const filtered = expenses.filter((e) => {
    const matchesSearch = e.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    const amountA = Number(a.amount) || 0;
    const amountB = Number(b.amount) || 0;
    const dateA = new Date(a.date || a.createdAt || 0);
    const dateB = new Date(b.date || b.createdAt || 0);

    switch (sortBy) {
      case "amount-asc":
        return amountA - amountB;
      case "amount-desc":
        return amountB - amountA;
      case "date-asc":
        return dateA - dateB;
      case "date-desc":
      default:
        return dateB - dateA;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(start, start + PAGE_SIZE);

  const handlePageChange = (next) => {
    if (next < 1 || next > totalPages) return;
    setPage(next);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-gray-500 dark:text-gray-400">
          {t("loadingExpenses")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24 text-red-500">
        {error}
      </div>
    );
  }

  const pendingExpense =
    pendingDeleteId && expenses.find((e) => e._id === pendingDeleteId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
            {t("expenses")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {t("trackSpending")}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-colors"
          >
            + {t("addExpense")}
          </button>
          <button
            onClick={toggleView}
            className="hidden sm:inline-flex p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700/80 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label={view === "card" ? t("expenses") : t("expenses")}
          >
            {view === "card" ? (
              <Table className="w-5 h-5" />
            ) : (
              <LayoutGrid className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 p-4 rounded-xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/80 shadow-sm">
        <div className="flex-1 min-w-0 flex items-center gap-2.5 rounded-lg border border-gray-200 dark:border-gray-700/80 bg-gray-50/80 dark:bg-gray-800/30 px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t("searchByTitle")}
            className="flex-1 min-w-0 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800/50 px-3 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          >
            <option value="all">{t("allCategories")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 rounded-lg border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800/50 px-3 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          >
            <option value="date-desc">{t("newestFirst")}</option>
            <option value="date-asc">{t("oldestFirst")}</option>
            <option value="amount-desc">{t("amountHighLow")}</option>
            <option value="amount-asc">{t("amountLowHigh")}</option>
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl py-16 flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {t("noExpensesYet")}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("startByAdding")}
          </p>
        </div>
      ) : (
        <>
          <div className="sm:hidden">
            <ExpenseCards
              expenses={pageItems}
              onDelete={requestDelete}
              onEdit={setEditExpense}
              deletingId={deletingId}
            />
          </div>
          <div className="hidden sm:block">
            {view === "card" ? (
              <ExpenseCards
                expenses={pageItems}
                onDelete={requestDelete}
                onEdit={setEditExpense}
                deletingId={deletingId}
              />
            ) : (
              <ExpenseTable
                expenses={pageItems}
                onDelete={requestDelete}
                onEdit={setEditExpense}
                deletingId={deletingId}
              />
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 text-xs text-gray-500 dark:text-gray-400">
            <span>
              {t("showing")}{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {sorted.length === 0 ? 0 : start + 1}-{start + pageItems.length}
              </span>{" "}
              of <span className="font-medium text-gray-700 dark:text-gray-300">{sorted.length}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {t("previous")}
              </button>
              <span className="px-2 py-1">
                {t("page")} {currentPage} {t("of")} {totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {t("next")}
              </button>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <AddExpenseModal
          onClose={() => setShowModal(false)}
          onAdd={handleCreateExpense}
        />
      )}

      {editExpense && (
        <EditExpenseModal
          expense={editExpense}
          onClose={() => setEditExpense(null)}
          onUpdate={handleUpdateExpense}
          updating={updating}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        title={t("deleteExpense")}
        description={
          pendingExpense
            ? `This will permanently delete “${pendingExpense.title}”.`
            : "This will permanently delete the selected expense."
        }
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        loadingLabel={t("deleting")}
        loading={deletingId === pendingDeleteId}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => handleDelete(pendingDeleteId)}
      />

      <TopNotification message={notification} />
    </div>
  );
};

export default Expenses;
