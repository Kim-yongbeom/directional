"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { CoffeeConsumptionResponse } from "@/lib/mockApi";
import { useMemo, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip);

type LegendItem = {
  key: string;
  label: string;
  color: string;
  visible: boolean;
};

const COLORS = ["#f97316", "#2563eb", "#9333ea"];

export const CoffeeConsumptionChart = ({
  data,
}: {
  data: CoffeeConsumptionResponse;
}) => {
  const [legend, setLegend] = useState<LegendItem[]>(
    data.teams.map((t, index) => ({
      key: t.team,
      label: t.team,
      color: COLORS[index % COLORS.length],
      visible: true,
    }))
  );

  const chartData = useMemo(() => {
    if (!data.teams.length) return { labels: [], datasets: [] };
    const base = data.teams[0].series;
    const labels = base.map((p) => p.cups);
    const datasets: any[] = [];

    legend.forEach((team) => {
      const teamData = data.teams.find((t) => t.team === team.key);
      if (!teamData) return;

      const bugs = labels.map(
        (cups) =>
          teamData.series.find((s) => s.cups === cups)?.bugs ?? null
      );
      const productivity = labels.map(
        (cups) =>
          teamData.series.find((s) => s.cups === cups)?.productivity ?? null
      );

      datasets.push({
        label: `${team.label} 버그`,
        data: bugs,
        borderColor: team.color,
        backgroundColor: team.color,
        yAxisID: "y",
        tension: 0.3,
        pointStyle: "circle",
        pointRadius: 3,
        hidden: !team.visible,
      });

      datasets.push({
        label: `${team.label} 생산성`,
        data: productivity,
        borderColor: team.color,
        backgroundColor: team.color,
        yAxisID: "y1",
        tension: 0.3,
        borderDash: [4, 2],
        pointStyle: "rect",
        pointRadius: 4,
        hidden: !team.visible,
      });
    });

    return { labels, datasets };
  }, [data.teams, legend]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: any) =>
            items.length ? `커피 ${items[0].label}잔` : "",
          // 한 팀의 X축(잔 수)에 해당하는 버그/생산성을 함께 표시
          label: (ctx: any) => {
            const label = ctx.label;
            const cups = Number(label);
            const [team] = String(ctx.dataset.label || "").split(" ");

            const teamData = data.teams.find((t) => t.team === team);
            const point = teamData?.series.find((s) => s.cups === cups);

            if (!teamData || !point) {
              return `${team} - 데이터 없음`;
            }

            return [
              `${team} - 버그: ${point.bugs}`,
              `${team} - 생산성: ${point.productivity}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "커피 잔 수" },
        grid: { display: false },
      } as const,
      y: {
        position: "left",
        title: { display: true, text: "버그 수" },
      } as const,
      y1: {
        position: "right",
        title: { display: true, text: "생산성 점수" },
        grid: { drawOnChartArea: false },
      } as const,
    },
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-gray-800">
        커피 섭취량 vs 버그 / 생산성 (Multi-Line)
      </h2>
      <p className="mb-4 text-xs text-gray-500">
        /mock/coffee-consumption 데이터를 활용한 멀티라인 차트
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


