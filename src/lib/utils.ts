import { AxiosError } from "axios";

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.response?.status === 401) return "Invalid email or password.";
    if (error.response?.status === 409) return "That email is already registered.";
  }
  return fallback;
}

export function formatMonth(year: number, month: number): string {
  return new Date(year, month - 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function dateOnly(isoString: string): string {
  return isoString.slice(0, 10);
}

export function currency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}
