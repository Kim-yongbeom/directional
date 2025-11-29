"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { SnackImpactResponse } from "@/lib/mockApi";
import { useMemo, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip);

type LegendItem = {
  key: string;
  label: string;
  color: string;
  visible: boolean;
};

const COLORS = ["#f97316", "#2563eb", "#9333ea"];

type SnackLineDataset = {
  label: string;
  data: (number | null)[];
  borderColor: string;
  backgroundColor: string;
  yAxisID: "y" | "y1";
  tension: number;
  pointStyle: "circle" | "rect";
  pointRadius: number;
  hidden: boolean;
  borderDash?: number[];
};

export const SnackImpactChart = ({
  data,
}: {
  data: SnackImpactResponse;
}) => {
  const [legend, setLegend] = useState<LegendItem[]>(
    data.departments.map((d, index) => ({
      key: d.name,
      label: d.name,
      color: COLORS[index % COLORS.length],
      visible: true,
    }))
  );

  const chartData = useMemo(() => {
    if (!data.departments.length) return { labels: [], datasets: [] };
    const base = data.departments[0].metrics;
    const labels = base.map((p) => p.snacks);
    const datasets: SnackLineDataset[] = [];

    legend.forEach((dept) => {
      const deptData = data.departments.find((d) => d.name === dept.key);
      if (!deptData) return;

      const meetings = labels.map(
        (snacks) =>
          deptData.metrics.find((m) => m.snacks === snacks)?.meetingsMissed ??
          null
      );
      const morale = labels.map(
        (snacks) =>
          deptData.metrics.find((m) => m.snacks === snacks)?.morale ?? null
      );

      datasets.push({
        label: `${dept.label} 회의불참`,
        data: meetings,
        borderColor: dept.color,
        backgroundColor: dept.color,
        yAxisID: "y",
        tension: 0.3,
        pointStyle: "circle",
        pointRadius: 3,
        hidden: !dept.visible,
      });

      datasets.push({
        label: `${dept.label} 사기`,
        data: morale,
        borderColor: dept.color,
        backgroundColor: dept.color,
        yAxisID: "y1",
        tension: 0.3,
        borderDash: [4, 2],
        pointStyle: "rect",
        pointRadius: 4,
        hidden: !dept.visible,
      });
    });

    return { labels, datasets };
  }, [data.departments, legend]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: TooltipItem<"line">[]) =>
            items.length ? `스낵 ${items[0].label}개` : "",
          // 한 부서의 X축(스낵 수)에 해당하는 회의불참/사기를 함께 표시
          label: (ctx: TooltipItem<"line">) => {
            const label = ctx.label as string;
            const snacks = Number(label);
            const [dept] = String(ctx.dataset.label || "").split(" ");

            const deptData = data.departments.find((d) => d.name === dept);
            const point = deptData?.metrics.find((m) => m.snacks === snacks);

            if (!deptData || !point) {
              return `${dept} - 데이터 없음`;
            }

            return [
              `${dept} - 회의불참: ${point.meetingsMissed}`,
              `${dept} - 사기: ${point.morale}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "스낵 개수" },
        grid: { display: false },
      } as const,
      y: {
        position: "left",
        title: { display: true, text: "회의불참" },
      } as const,
      y1: {
        position: "right",
        title: { display: true, text: "사기" },
        grid: { drawOnChartArea: false },
      } as const,
    },
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-gray-800">
        스낵 섭취량 vs 회의불참 / 사기 (Multi-Line)
      </h2>
      <p className="mb-4 text-xs text-gray-500">
        /mock/snack-impact 데이터를 활용한 멀티라인 차트
      </p>
      <div className="h-72">
        <Line data={chartData} options={options} />
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


