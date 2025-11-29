"use client";

import { CoffeeBrandsCharts } from "./coffee/CoffeeBrandsCharts";
import { SnackBrandsCharts } from "./snack/SnackBrandsCharts";
import { WeeklyMoodCharts } from "./mood/WeeklyMoodCharts";
import { WeeklyWorkoutCharts } from "./workout/WeeklyWorkoutCharts";
import { CoffeeConsumptionChart } from "./multi/CoffeeConsumptionChart";
import { SnackImpactChart } from "./multi/SnackImpactChart";
import {
  fetchCoffeeConsumption,
  fetchSnackImpact,
  fetchTopCoffeeBrands,
  fetchPopularSnackBrands,
  fetchWeeklyMoodTrend,
  fetchWeeklyWorkoutTrend,
  type CoffeeBrand,
  type SnackBrand,
  type WeeklyMood,
  type WeeklyWorkout,
} from "@/lib/mockApi";
import { useQuery } from "@tanstack/react-query";

const Mock = () => {
  const coffeeBrands = useQuery<CoffeeBrand[]>({
    queryKey: ["mock", "coffee-brands"],
    queryFn: fetchTopCoffeeBrands,
  });

  const snackBrands = useQuery<SnackBrand[]>({
    queryKey: ["mock", "snack-brands"],
    queryFn: fetchPopularSnackBrands,
  });

  const moodTrend = useQuery<WeeklyMood[]>({
    queryKey: ["mock", "mood-trend"],
    queryFn: fetchWeeklyMoodTrend,
  });

  const workoutTrend = useQuery<WeeklyWorkout[]>({
    queryKey: ["mock", "workout-trend"],
    queryFn: fetchWeeklyWorkoutTrend,
  });

  const coffeeConsumption = useQuery({
    queryKey: ["mock", "coffee-consumption"],
    queryFn: fetchCoffeeConsumption,
  });

  const snackImpact = useQuery({
    queryKey: ["mock", "snack-impact"],
    queryFn: fetchSnackImpact,
  });

  const isLoading =
    coffeeBrands.isLoading ||
    snackBrands.isLoading ||
    moodTrend.isLoading ||
    workoutTrend.isLoading ||
    coffeeConsumption.isLoading ||
    snackImpact.isLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Mock 차트 데이터를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[2000px] flex-col gap-6 px-6 pb-8">
      <div className="grid gap-6 md:grid-cols-2">
        {coffeeBrands.data && (
          <CoffeeBrandsCharts data={coffeeBrands.data} />
        )}
        {snackBrands.data && <SnackBrandsCharts data={snackBrands.data} />}
      </div>

      {moodTrend.data && <WeeklyMoodCharts data={moodTrend.data} />}
      {workoutTrend.data && <WeeklyWorkoutCharts data={workoutTrend.data} />}

      {coffeeConsumption.data && (
        <CoffeeConsumptionChart data={coffeeConsumption.data} />
      )}

      {snackImpact.data && <SnackImpactChart data={snackImpact.data} />}
    </div>
  );
};

export default Mock;

