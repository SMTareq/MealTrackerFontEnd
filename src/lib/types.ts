export type Role = "Admin" | "User";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  user: User;
}

export interface Meal {
  id: number;
  userId: number;
  date: string; // ISO datetime string
  count: number;
  isGuest: boolean;
  GuestCount: number;
  note?: string | null;
}

export interface Expense {
  id: number;
  userId: number;
  date: string; // ISO datetime string
  countDate: string; // ISO datetime string — the month/period this expense counts toward
  category: string;
  amount: number;
  note?: string | null;
}

export interface MonthlySummary {
  userId: number;
  userName: string;
  year: number;
  month: number;
  totalMeals: number;
  totalExpense: number;
  mealRate: number;
}
