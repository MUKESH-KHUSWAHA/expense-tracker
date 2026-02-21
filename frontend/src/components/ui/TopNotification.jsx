const TopNotification = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-notification-in">
      <div className="rounded-lg bg-gray-800 dark:bg-gray-900 text-gray-100 px-4 py-2.5 text-sm shadow-xl border border-gray-700/60 dark:border-gray-700/40">
        {message}
      </div>
    </div>
  );
};

export default TopNotification;
