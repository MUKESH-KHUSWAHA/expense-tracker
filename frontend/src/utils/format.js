import { convertInrToDisplay } from "./currencyUtils.js";

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€" };

const CURRENCY_OPTIONS = { minimumFractionDigits: 0, maximumFractionDigits: 2 };

/**
 * Format a number with currency symbol (no conversion).
 * Use when value is already in display currency (e.g. chart tooltips).
 */
export function formatAmountOnly(amount, currency = "INR") {
  const num = Number(amount) || 0;
  const symbol = CURRENCY_SYMBOLS[currency] || "₹";
  return `${symbol} ${Intl.NumberFormat(undefined, CURRENCY_OPTIONS).format(num)}`;
}

/**
 * Format amount for display. Amount is in INR (base currency).
 * Converts to selected currency and formats.
 */
export function formatCurrency(amountInr, currency = "INR") {
  const converted = convertInrToDisplay(amountInr, currency);
  const symbol = CURRENCY_SYMBOLS[currency] || "₹";
  return `${symbol} ${Intl.NumberFormat(undefined, CURRENCY_OPTIONS).format(converted)}`;
}

export function formatDate(value, dateFormat = "DD/MM/YYYY") {
  if (!value) return "-";
  const d = new Date(value);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  if (dateFormat === "MM/DD/YYYY") return `${month}/${day}/${year}`;
  return `${day}/${month}/${year}`;
}

export function formatDateShort(value, dateFormat = "DD/MM/YYYY") {
  if (!value) return "-";
  const d = new Date(value);
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "short" });
  const year = d.getFullYear();
  if (dateFormat === "MM/DD/YYYY") return `${month} ${day}, ${year}`;
  return `${day} ${month} ${year}`;
}
