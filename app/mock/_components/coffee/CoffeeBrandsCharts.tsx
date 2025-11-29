"use client";

import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
} from "chart.js";
import type { CoffeeBrand } from "@/lib/mockApi";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip);

type BrandLegend = {
  [label: string]: {
    color: string;
    visible: boolean;
  };
};

const COFFEE_COLORS = ["#f23d67", "#22c55e", "#06b6d4", "#f97316", "#a855f7"];

interface CoffeeBrandsChartsProps {
  data: CoffeeBrand[];
}

export const CoffeeBrandsCharts = ({ data }: CoffeeBrandsChartsProps) => {
  const [legend, setLegend] = useState<BrandLegend>({});

  useEffect(() => {
    if (!data || data.length === 0) return;

    const currentLabels = data.map((d: CoffeeBrand) => d.brand);

    setLegend((prev) => {
      const next: BrandLegend = { ...prev };

      // 새 라벨 추가
      currentLabels.forEach((label, index) => {
        if (!next[label]) {
          next[label] = {
            color: COFFEE_COLORS[index % COFFEE_COLORS.length],
            visible: true,
          };
        }
      });

      // 사라진 라벨 정리
      Object.keys(next).forEach((key) => {
        if (!currentLabels.includes(key)) {
          delete next[key];
        }
      });

      return next;
    });
  }, [data]);

  const labels = data.map((d: CoffeeBrand) => d.brand);

  if (!data.length || labels.length === 0) return null;

  const barData = {
    labels,
    datasets: [
      {
        label: "인기도",
        data: data.map((d) =>
          legend[d.brand]?.visible ? d.popularity : 0
        ),
        backgroundColor: labels.map((label) => {
          const item = legend[label];
          if (!item || !item.visible) return "rgba(0,0,0,0)";
          return item.color;
        }),
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels,
    datasets: [
      {
        label: "인기도",
        data: data.map((d) =>
          legend[d.brand]?.visible ? d.popularity : 0
        ),
        backgroundColor: labels.map((label) => {
          const item = legend[label];
          if (!item || !item.visible) return "rgba(0,0,0,0)";
          return item.color;
        }),
        borderWidth: 0,
      },
    ],
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-gray-800">커피 브랜드 선호도</h2>
      <p className="mb-4 text-xs text-gray-500">
        /mock/top-coffee-brands 데이터를 활용한 바 차트와 도넛 차트
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-56">
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false } },
                y: { grid: { color: "#e5e7eb" } },
              },
            }}
          />
        </div>

        <div className="h-56 flex items-center justify-center">
          <Doughnut
            data={doughnutData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "60%",
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
        {labels.map((label) => {
          const item = legend[label];
          if (!item) return null;

          return (
            <div
              key={label}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1 bg-white"
            >
              <button
                type="button"
                onClick={() =>
                  setLegend((prev) => ({
                    ...prev,
                    [label]: {
                      ...prev[label],
                      visible: !prev[label].visible,
                    },
                  }))
                }
                className="inline-flex items-center gap-1 cursor-pointer"
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: item.visible ? item.color : "#e5e7eb",
                  }}
                />
                <span>{label}</span>
              </button>
              <input
                type="color"
                value={item.color}
                onChange={(e) =>
                  setLegend((prev) => ({
                    ...prev,
                    [label]: { ...prev[label], color: e.target.value },
                  }))
                }
                className="h-4 w-4 cursor-pointer border-none bg-transparent p-0"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};


