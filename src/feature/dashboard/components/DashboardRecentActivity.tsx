import type { TDashboardRecentActivityItem } from "@lib/types/dashboard";

interface DashboardRecentActivityProps {
  items: TDashboardRecentActivityItem[];
  isRealData: boolean;
}

const getTypeLabel = (type: TDashboardRecentActivityItem["type"]) => {
  const labels: Record<TDashboardRecentActivityItem["type"], string> = {
    created: "creó",
    updated: "actualizó",
    completed: "completó",
    pending: "dejó pendiente",
    canceled: "canceló",
    deleted: "eliminó",
  };

  return labels[type];
};

const getTypeColors = (type: TDashboardRecentActivityItem["type"]) => {
  const colors: Record<TDashboardRecentActivityItem["type"], { bg: string; text: string }> = {
    created: { bg: "#EEF4FF", text: "#4F7CF7" },
    updated: { bg: "#F3F4F6", text: "#60708A" },
    completed: { bg: "#E9FBF5", text: "#14B88E" },
    pending: { bg: "#FFF4DF", text: "#D18C12" },
    canceled: { bg: "#FFF1F2", text: "#E11D48" },
    deleted: { bg: "#FFF1F2", text: "#E11D48" },
  };

  return colors[type];
};

const formatRelativeDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) return `hace ${diffMinutes} min`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `hace ${diffHours} h`;

  const diffDays = Math.round(diffHours / 24);
  return `hace ${diffDays} d`;
};

export const DashboardRecentActivity = ({
  items,
  isRealData,
}: DashboardRecentActivityProps) => {
  return (
    <div>
      {!isRealData && (
        <p className="mb-4 text-[13px] text-[#E11D48]">
          La actividad reciente necesita un endpoint del backend.
        </p>
      )}

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="text-[14px] text-[#94A3B8]">
            No hay actividad reciente para mostrar.
          </p>
        )}

        {items.map((item, index) => {
          const colors = getTypeColors(item.type);
          return (
            <div
              key={`${item.id}-${index}`}
              className="flex items-start gap-4 border-b border-[#E8EEF8] pb-4 last:border-b-0 last:pb-0"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {item.username.slice(0, 1).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="text-[15px] leading-6 text-[#1F2A44]">
                  <span className="font-semibold">{item.username}</span>{" "}
                  {getTypeLabel(item.type)} la cita{" "}
                  <span className="font-medium text-[#3972FF]">
                    "{item.appointment_name}"
                  </span>
                </p>
                <p className="mt-1 text-[13px] text-[#94A3B8]">
                  {formatRelativeDate(item.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
