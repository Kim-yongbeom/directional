"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import type { WeeklyMood } from "@/lib/mockApi";
import { useMemo, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Filler
);

type LegendItem = {
  key: keyof WeeklyMood;
  label: string;
  color: string;
  visible: boolean;
};

const COLORS = ["#f97316", "#22c55e", "#06b6d4"];

const toRgba = (hex: string, alpha: number) => {
  const value = hex.replace("#", "");
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const normalize = (rows: WeeklyMood[]): WeeklyMood[] => {
  return rows.map((row) => {
    const total = row.happy + row.tired + row.stressed || 1;
    return {
      ...row,
      happy: (row.happy / total) * 100,
      tired: (row.tired / total) * 100,
      stressed: (row.stressed / total) * 100,
    };
  });
};

interface WeeklyMoodChartsProps {
  data: WeeklyMood[];
}

export const WeeklyMoodCharts = ({ data }: WeeklyMoodChartsProps) => {
  const [legend, setLegend] = useState<LegendItem[]>([
    { key: "happy", label: "행복", color: COLORS[0], visible: true },
    { key: "tired", label: "피곤", color: COLORS[1], visible: true },
    { key: "stressed", label: "스트레스", color: COLORS[2], visible: true },
  ]);

  const rows = useMemo(() => normalize(data ?? []), [data]);
  if (!rows.length) return null;

  const labels = rows.map((r) => r.week);

  const buildDatasets = (type: "bar" | "area") =>
    legend.map((item) => {
      const baseColor = item.color;
      const fillColor = type === "area" ? toRgba(baseColor, 0.25) : baseColor;

      return {
        label: item.label,
        data: rows.map((r) => r[item.key]),
        backgroundColor: fillColor,
        borderColor: baseColor,
        hidden: !item.visible,
        fill: type === "area",
        stack: "mood",
        // 선/포인트가 차트 영역 경계 밖으로 나가도 잘리지 않도록
        clip: false as const,
      };
    });

  const stackedBarData = {
    labels,
    datasets: buildDatasets("bar"),
  };

  const stackedAreaData = {
    labels,
    datasets: buildDatasets("area"),
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-gray-800">
        주간 기분 트렌드 (스택형 바 / 면적)
      </h2>
      <p className="mb-4 text-xs text-gray-500">
        /mock/weekly-mood-trend 데이터를 활용한 100% 스택형 바/면적 차트
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-56">
          <Bar
            data={stackedBarData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { stacked: true, grid: { display: false } },
                y: {
                  stacked: true,
                  ticks: { callback: (v) => `${v}%` },
                  max: 100,
                },
              },
            }}
          />
        </div>

        <div className="h-56">
          <Line
            data={stackedAreaData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              elements: {
                line: { tension: 0.3 },
              },
              scales: {
                x: { stacked: true, grid: { display: false } },
                y: {
                  stacked: true,
                  ticks: { callback: (v) => `${v}%` },
                  max: 100,
                },
              },
            }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
        {legend.map((item) => (
          <div
            key={item.key}
            className={`inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1 ${
              item.visible ? "bg-white" : "bg-gray-50 text-gray-400"
            }`}
          >
            <button
              type="button"
              onClick={() =>
                setLegend((prev) =>
                  prev.map((p) =>
                    p.key === item.key ? { ...p, visible: !p.visible } : p
                  )
                )
              }
              className="flex items-center gap-1 cursor-pointer"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: item.visible ? item.color : "#e5e7eb",
                }}
              />
              <span>{item.label}</span>
            </button>
            <input
              type="color"
              value={item.color}
              onChange={(e) =>
                setLegend((prev) =>
                  prev.map((p) =>
                    p.key === item.key ? { ...p, color: e.target.value } : p
                  )
                )
              }
              className="h-4 w-4 cursor-pointer border-none bg-transparent p-0"
            />
          </div>
        ))}
      </div>
    </section>
  );
};


