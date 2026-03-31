import type { TAccountActivityItem } from "@lib/types/account";

interface AccountRecentActivityProps {
  items: TAccountActivityItem[];
  isRealData: boolean;
}

const getTone = (type: TAccountActivityItem["type"]) => {
  const tones: Record<
    TAccountActivityItem["type"],
    { bg: string; color: string; label: string }
  > = {
    created: { bg: "#EEF4FF", color: "#3972FF", label: "C" },
    updated: { bg: "#FFF3E8", color: "#F97316", label: "E" },
    completed: { bg: "#EAFBF4", color: "#12B886", label: "OK" },
    pending: { bg: "#FFF4DF", color: "#F29B07", label: "P" },
    deleted: { bg: "#FFF1F2", color: "#E11D48", label: "X" },
  };

  return tones[type];
};

const formatRelativeDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));
  if (diffMinutes < 60) return `Hoy · ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  return `Hace ${Math.round(diffHours / 24)} d`;
};

export const AccountRecentActivity = ({
  items,
  isRealData,
}: AccountRecentActivityProps) => {
  return (
    <div>
      {!isRealData && (
        <p className="mb-4 text-[13px] text-[#E11D48]">
          Actividad reciente generada con fallback local.
        </p>
      )}

      <div className="space-y-5">
        {items.length === 0 && (
          <p className="text-[14px] text-[#94A3B8]">
            No hay actividad reciente para mostrar.
          </p>
        )}

        {items.map((item, index) => {
          const tone = getTone(item.type);

          return (
            <div
              key={`${item.id}-${index}`}
              className="flex items-start gap-4 border-b border-[#E8EEF8] pb-5 last:border-b-0 last:pb-0"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                style={{ backgroundColor: tone.bg, color: tone.color }}
              >
                {tone.label}
              </div>

              <div>
                <p className="text-[16px] text-[#1F2A44]">{item.title}</p>
                {item.subtitle && (
                  <p className="mt-1 text-[13px] text-[#3972FF]">{item.subtitle}</p>
                )}
                <p className="mt-1.5 text-[13px] text-[#94A3B8]">
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
