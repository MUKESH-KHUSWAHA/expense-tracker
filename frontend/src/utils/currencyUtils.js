/**
 * Base currency: INR
 * All expense amounts are stored in INR.
 * Conversion applied on display only.
 */
const INR_TO_USD = 0.012;
const INR_TO_EUR = 0.011;

export function convertInrToDisplay(amountInr, displayCurrency = "INR") {
  const num = Number(amountInr) || 0;
  if (displayCurrency === "USD") return num * INR_TO_USD;
  if (displayCurrency === "EUR") return num * INR_TO_EUR;
  return num;
}
