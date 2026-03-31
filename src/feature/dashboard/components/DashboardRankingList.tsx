import type { TDashboardRankingItem } from "@lib/types/dashboard";

interface DashboardRankingListProps {
  items: TDashboardRankingItem[];
  isRealData: boolean;
}

const COLORS = ["#F59E0B", "#4F7CF7", "#14B88E", "#7C3AED", "#F43F5E", "#94A3B8"];

export const DashboardRankingList = ({
  items,
  isRealData,
}: DashboardRankingListProps) => {
  const maxValue = Math.max(1, ...items.map((item) => item.count));

  return (
    <div>
      {!isRealData && (
        <p className="mb-4 text-[13px] text-[#E11D48]">
          Ranking cargado con datos de respaldo.
        </p>
      )}

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-[14px] text-[#94A3B8]">No hay ranking disponible.</p>
        )}

        {items.map((item, index) => (
          <div key={`${item.username}-${index}`} className="grid grid-cols-[20px_100px_1fr] items-center gap-3">
            <span className="text-[14px] font-semibold text-[#94A3B8]">{index + 1}</span>
            <span className="truncate text-[15px] font-semibold text-[#1F2A44]">
              {item.username}
            </span>
            <div className="relative h-11 overflow-hidden rounded-[12px] bg-[#EFF3FA]">
              <div
                className="flex h-full items-center justify-end rounded-[12px] px-3 text-[15px] font-semibold text-white"
                style={{
                  width: `${Math.max(10, (item.count / maxValue) * 100)}%`,
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              >
                {item.count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
