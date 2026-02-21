const Toast = ({ message, type = "success", onClose }) => {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`min-w-[240px] rounded-xl px-4 py-3 text-sm shadow-lg border ${
          isError
            ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/60 dark:border-red-900 dark:text-red-100"
            : "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-100"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <p>{message}</p>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;

