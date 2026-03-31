import type { TDashboardMonthlyPoint } from "@lib/types/dashboard";
import { useState } from "react";

interface DashboardTrendChartProps {
  data: TDashboardMonthlyPoint[];
  isRealData: boolean;
}

const SERIES = [
  { key: "created", label: "Creadas", color: "#2563EB" },
  { key: "completed", label: "Completadas", color: "#10B981" },
  { key: "pending", label: "Pendientes", color: "#D18C12" },
] as const;

const CHART_HEIGHT = 220;
const CHART_WIDTH = 640;
const PADDING = 32;

const getPointX = (index: number, pointCount: number) => {
  const usableWidth = CHART_WIDTH - PADDING * 2;

  if (pointCount <= 1) {
    return PADDING + usableWidth / 2;
  }

  return PADDING + (index / (pointCount - 1)) * usableWidth;
};

const getPointY = (value: number, maxValue: number) => {
  const usableHeight = CHART_HEIGHT - PADDING * 2;
  return PADDING + usableHeight - (value / maxValue) * usableHeight;
};

const buildPath = (values: number[], maxValue: number, pointCount: number) => {
  if (pointCount === 0) return "";

  return values
    .map((value, index) => {
      const x = getPointX(index, pointCount);
      const y = getPointY(value, maxValue);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

export const DashboardTrendChart = ({
  data,
  isRealData,
}: DashboardTrendChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(
    10,
    ...data.flatMap((item) => [item.created, item.completed, item.pending])
  );

  const gridValues = Array.from({ length: 5 }, (_, index) =>
    Math.round((maxValue / 4) * (4 - index))
  );

  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : null;
  const activeX =
    hoveredIndex !== null ? getPointX(hoveredIndex, data.length) : null;
  const activeTopY =
    hoveredIndex !== null && activeItem
      ? Math.min(
          getPointY(activeItem.created, maxValue),
          getPointY(activeItem.completed, maxValue),
          getPointY(activeItem.pending, maxValue)
        )
      : null;
  const showTooltipBelow = activeTopY !== null && activeTopY < 72;

  return (
    <div>
      {!isRealData && (
        <p className="mb-4 text-[13px] text-[#E11D48]">
          Esta seccion esta usando fallback local.
        </p>
      )}

      <div className="rounded-[20px] bg-[linear-gradient(180deg,#F8FBFF_0%,#FFFFFF_100%)] p-4">
        <div className="relative">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-[240px] w-full"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {gridValues.map((value, index) => {
              const y =
                PADDING +
                ((CHART_HEIGHT - PADDING * 2) / (gridValues.length - 1)) * index;

              return (
                <g key={value}>
                  <line
                    x1={PADDING}
                    x2={CHART_WIDTH - PADDING}
                    y1={y}
                    y2={y}
                    stroke="#DCE6F5"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={PADDING - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="12"
                    fill="#94A3B8"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {hoveredIndex !== null && activeX !== null && (
              <line
                x1={activeX}
                x2={activeX}
                y1={PADDING}
                y2={CHART_HEIGHT - PADDING}
                stroke="#C8D6EE"
                strokeDasharray="4 4"
              />
            )}

            {data.map((item, index) => {
              const x = getPointX(index, data.length);
              const nextX =
                index < data.length - 1
                  ? getPointX(index + 1, data.length)
                  : CHART_WIDTH - PADDING;
              const prevX =
                index > 0 ? getPointX(index - 1, data.length) : PADDING;
              const segmentWidth =
                data.length === 1 ? CHART_WIDTH - PADDING * 2 : (nextX - prevX) / 2;

              return (
                <g key={item.month}>
                  <rect
                    x={Math.max(PADDING, x - segmentWidth)}
                    y={PADDING / 2}
                    width={Math.min(CHART_WIDTH - PADDING, x + segmentWidth) - Math.max(PADDING, x - segmentWidth)}
                    height={CHART_HEIGHT - PADDING}
                    fill="transparent"
                    onMouseEnter={() => setHoveredIndex(index)}
                  />
                  <text
                    x={x}
                    y={CHART_HEIGHT - 8}
                    textAnchor="middle"
                    fontSize="12"
                    fill={hoveredIndex === index ? "#1F2A44" : "#94A3B8"}
                    fontWeight={hoveredIndex === index ? "700" : "500"}
                  >
                    {item.label}
                  </text>
                </g>
              );
            })}

            {SERIES.map((series) => {
              const values = data.map((item) => item[series.key]);
              const path = buildPath(values, maxValue, data.length);

              return (
                <g key={series.key}>
                  <path
                    d={path}
                    fill="none"
                    stroke={series.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {values.map((value, index) => {
                    const x = getPointX(index, data.length);
                    const y = getPointY(value, maxValue);
                    const isActive = hoveredIndex === index;

                    return (
                      <circle
                        key={`${series.key}-${data[index]?.month ?? index}`}
                        cx={x}
                        cy={y}
                        r={isActive ? "6" : "4.5"}
                        fill={series.color}
                        stroke="#fff"
                        strokeWidth={isActive ? "3" : "2"}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {activeItem && activeX !== null && activeTopY !== null && (
            <div
              className="pointer-events-none absolute z-20 w-[156px] rounded-[12px] bg-[#2C2F36] px-3 py-2 text-white shadow-[0_10px_24px_rgba(15,23,42,0.35)]"
              style={{
                left: `${(activeX / CHART_WIDTH) * 100}%`,
                top: `${(activeTopY / CHART_HEIGHT) * 100}%`,
                transform: showTooltipBelow
                  ? "translate(-50%, 16px)"
                  : "translate(-50%, calc(-100% - 14px))",
              }}
            >
              <p className="mb-2 text-[14px] font-semibold">{activeItem.label}</p>
              <div className="space-y-1.5 text-[12px]">
                {SERIES.map((series) => (
                  <div key={series.key} className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-[2px]"
                      style={{ backgroundColor: series.color }}
                    />
                    <span className="font-medium">
                      {series.label}: {activeItem[series.key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-5">
        {SERIES.map((series) => (
          <div
            key={series.key}
            className="flex items-center gap-2 text-[14px] text-[#60708A]"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: series.color }}
            />
            <span>{series.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
