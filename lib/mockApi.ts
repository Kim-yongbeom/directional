import { apiRequest } from "./apiClient";

export interface MockPost {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: "NOTICE" | "QNA" | "FREE";
  tags: string[];
  createdAt: string;
}

export interface MockPostsResponse {
  items: MockPost[];
  count: number;
}

export interface CoffeeBrand {
  brand: string;
  popularity: number;
}

export interface SnackBrand {
  name: string;
  share: number;
}

export interface WeeklyMood {
  week: string;
  happy: number;
  tired: number;
  stressed: number;
}

export interface WeeklyWorkout {
  week: string;
  running: number;
  cycling: number;
  stretching: number;
}

export interface CoffeeSeriesPoint {
  cups: number;
  bugs: number;
  productivity: number;
}

export interface CoffeeTeam {
  team: string;
  series: CoffeeSeriesPoint[];
}

export interface CoffeeConsumptionResponse {
  teams: CoffeeTeam[];
}

export interface SnackMetricsPoint {
  snacks: number;
  meetingsMissed: number;
  morale: number;
}

export interface SnackDepartment {
  name: string;
  metrics: SnackMetricsPoint[];
}

export interface SnackImpactResponse {
  departments: SnackDepartment[];
}

export const fetchMockPosts = () =>
  apiRequest<MockPostsResponse>("/mock/posts", {
    method: "GET",
    auth: false,
  });

export const fetchTopCoffeeBrands = () =>
  apiRequest<CoffeeBrand[]>("/mock/top-coffee-brands", {
    method: "GET",
    auth: false,
  });

export const fetchPopularSnackBrands = () =>
  apiRequest<SnackBrand[]>("/mock/popular-snack-brands", {
    method: "GET",
    auth: false,
  });

export const fetchWeeklyMoodTrend = () =>
  apiRequest<WeeklyMood[]>("/mock/weekly-mood-trend", {
    method: "GET",
    auth: false,
  });

export const fetchWeeklyWorkoutTrend = () =>
  apiRequest<WeeklyWorkout[]>("/mock/weekly-workout-trend", {
    method: "GET",
    auth: false,
  });

export const fetchCoffeeConsumption = () =>
  apiRequest<CoffeeConsumptionResponse>("/mock/coffee-consumption", {
    method: "GET",
    auth: false,
  });

export const fetchSnackImpact = () =>
  apiRequest<SnackImpactResponse>("/mock/snack-impact", {
    method: "GET",
    auth: false,
  });


