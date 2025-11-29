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
import type { SnackBrand } from "@/lib/mockApi";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip);

type BrandLegend = {
  [label: string]: {
    color: string;
    visible: boolean;
  };
};

const SNACK_COLORS = ["#2563eb", "#f97316", "#e11d48", "#84cc16", "#a855f7"];

interface SnackBrandsChartsProps {
  data: SnackBrand[];
}

export const SnackBrandsCharts = ({ data }: SnackBrandsChartsProps) => {
  const [legend, setLegend] = useState<BrandLegend>({});

  useEffect(() => {
    if (!data || data.length === 0) return;

    const currentLabels = data.map((d: SnackBrand) => d.name);

    // 초기 legend 동기화를 위한 효과로, 외부 데이터(data)에 맞춰 한 번만 정리
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLegend((prev) => {
      const next: BrandLegend = { ...prev };

      currentLabels.forEach((label, index) => {
        if (!next[label]) {
          next[label] = {
            color: SNACK_COLORS[index % SNACK_COLORS.length],
            visible: true,
          };
        }
      });

      Object.keys(next).forEach((key) => {
        if (!currentLabels.includes(key)) {
          delete next[key];
        }
      });

      return next;
    });
  }, [data]);

  const labels = data.map((d: SnackBrand) => d.name);

  if (!data.length || labels.length === 0) return null;

  const barData = {
    labels,
    datasets: [
      {
        label: "점유율",
        data: data.map((d) =>
          legend[d.name]?.visible ? d.share : 0
        ),
        backgroundColor: labels.map((label) => {
          const item = legend[label];
          if (!item || !item.visible) return "transparent";
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
        label: "점유율",
        data: data.map((d) =>
          legend[d.name]?.visible ? d.share : 0
        ),
        backgroundColor: labels.map((label) => {
          const item = legend[label];
          if (!item || !item.visible) return "transparent";
          return item.color;
        }),
        borderWidth: 0,
      },
    ],
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-gray-800">스낵 브랜드 점유율</h2>
      <p className="mb-4 text-xs text-gray-500">
        /mock/popular-snack-brands 데이터를 활용한 바 차트와 도넛 차트
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
          console.log(label, item)
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


