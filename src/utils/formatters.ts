/**
 * Official Centralized Currency & Price Formatter for LankaVoyage
 * ALL prices are strictly displayed in Sri Lankan Rupees (LKR).
 */

export function formatPrice(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return 'LKR 0';
  }
  const numeric = Math.round(Number(amount));
  return `LKR ${numeric.toLocaleString('en-US')}`;
}

export function formatLKR(amount: number | string | undefined | null): string {
  return formatPrice(amount);
}
