export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatTokenAmount(amount: number, token: string) {
  return `${formatNumber(amount)} ${token}`;
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatFullDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatMonthLabel(month: string) {
  const [year, rawMonth] = month.split("-");
  const date = new Date(Number(year), Number(rawMonth) - 1, 1);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function shortenAddress(address: string, leading = 6, trailing = 4) {
  if (address.length <= leading + trailing) {
    return address;
  }

  return `${address.slice(0, leading)}...${address.slice(-trailing)}`;
}

