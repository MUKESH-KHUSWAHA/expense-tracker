/**
 * Date range filtering for Analytics. All dates in local time.
 * Expenses use date || createdAt for the expense date.
 */

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x.getTime();
}

export const RANGE_KEYS = {
  LAST_7: "last7",
  LAST_30: "last30",
  THIS_MONTH: "thisMonth",
  ALL: "all",
};

/**
 * Get expense date as timestamp (start of day) for range comparison.
 */
export function getExpenseDateTs(expense) {
  const raw = expense.date || expense.createdAt;
  if (!raw) return null;
  return startOfDay(new Date(raw));
}

/**
 * Current period bounds [startTs, endTs] (start and end of day).
 * Returns null for "all" (no filter).
 */
export function getCurrentRange(rangeKey) {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  if (rangeKey === RANGE_KEYS.ALL) return null;

  if (rangeKey === RANGE_KEYS.LAST_7) {
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    return { startTs: startOfDay(start), endTs: todayEnd };
  }

  if (rangeKey === RANGE_KEYS.LAST_30) {
    const start = new Date(now);
    start.setDate(start.getDate() - 29);
    return { startTs: startOfDay(start), endTs: todayEnd };
  }

  if (rangeKey === RANGE_KEYS.THIS_MONTH) {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { startTs: startOfDay(start), endTs: todayEnd };
  }

  return null;
}

/**
 * Previous period of same length. Returns null for "all" or if not applicable.
 */
export function getPreviousRange(rangeKey) {
  const now = new Date();

  if (rangeKey === RANGE_KEYS.ALL) return null;

  if (rangeKey === RANGE_KEYS.LAST_7) {
    const end = new Date(now);
    end.setDate(end.getDate() - 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    return { startTs: startOfDay(start), endTs: endOfDay(end) };
  }

  if (rangeKey === RANGE_KEYS.LAST_30) {
    const end = new Date(now);
    end.setDate(end.getDate() - 30);
    const start = new Date(end);
    start.setDate(start.getDate() - 29);
    return { startTs: startOfDay(start), endTs: endOfDay(end) };
  }

  if (rangeKey === RANGE_KEYS.THIS_MONTH) {
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { startTs: startOfDay(lastMonth), endTs: end.getTime() };
  }

  return null;
}

/**
 * Filter expenses that fall within [startTs, endTs] (inclusive of full days).
 */
export function filterExpensesByRange(expenses, rangeKey) {
  const range = getCurrentRange(rangeKey);
  if (!range) return expenses;

  const { startTs, endTs } = range;
  return expenses.filter((e) => {
    const ts = getExpenseDateTs(e);
    if (ts == null) return false;
    const dayEnd = ts + 24 * 60 * 60 * 1000 - 1;
    return ts <= endTs && dayEnd >= startTs;
  });
}

/**
 * Filter expenses for previous period (for comparison).
 */
export function filterExpensesPreviousPeriod(expenses, rangeKey) {
  const range = getPreviousRange(rangeKey);
  if (!range) return [];

  const { startTs, endTs } = range;
  return expenses.filter((e) => {
    const ts = getExpenseDateTs(e);
    if (ts == null) return false;
    const dayEnd = ts + 24 * 60 * 60 * 1000 - 1;
    return ts <= endTs && dayEnd >= startTs;
  });
}

/**
 * Number of days in the current range (for average daily).
 */
export function getDaysInRange(rangeKey) {
  const range = getCurrentRange(rangeKey);
  if (!range) return 0;
  const days = Math.ceil((range.endTs - range.startTs + 1) / (24 * 60 * 60 * 1000));
  return Math.max(1, days);
}
