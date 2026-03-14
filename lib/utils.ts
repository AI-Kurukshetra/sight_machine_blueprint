export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatRelativeDays(days: number) {
  if (days <= 0) {
    return "Due now";
  }

  if (days === 1) {
    return "1 day";
  }

  return `${days} days`;
}
