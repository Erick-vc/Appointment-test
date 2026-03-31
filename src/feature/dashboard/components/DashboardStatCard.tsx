interface DashboardStatCardProps {
  title: string;
  value: number;
  accent: string;
  softAccent: string;
  progressValue?: number;
  progressLabelLeft?: string;
  progressLabelRight?: string;
  footerLabel?: string;
  footerValue?: string;
  isRealData?: boolean;
}

export const DashboardStatCard = ({
  title,
  value,
  accent,
  softAccent,
  progressValue = 0,
  progressLabelLeft,
  progressLabelRight,
  footerLabel,
  footerValue,
  isRealData = true,
}: DashboardStatCardProps) => {
  return (
    <article
      className="relative overflow-hidden rounded-[24px] border border-white/80 bg-white p-6 shadow-[0_18px_45px_rgba(64,87,144,0.12)]"
      style={{ boxShadow: "0 18px 45px rgba(64,87,144,0.12)" }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: accent }}
      />
      <div
        className="absolute right-[-22px] top-[-22px] h-24 w-24 rounded-full"
        style={{ backgroundColor: softAccent }}
      />

      <div className="relative">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-[15px] font-semibold text-[#50607D]">{title}</p>
            {!isRealData && (
              <span className="mt-2 inline-flex rounded-full bg-[#FFF1F2] px-2.5 py-1 text-[11px] font-semibold text-[#E11D48]">
                data false
              </span>
            )}
          </div>
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-[14px] font-bold"
            style={{ color: accent, backgroundColor: softAccent }}
          >
            {String(value).slice(0, 2)}
          </div>
        </div>

        <p className="text-[44px] font-semibold leading-none" style={{ color: accent }}>
          {value}
        </p>

        <div className="mt-5">
          {(progressLabelLeft || progressLabelRight) && (
            <div className="mb-2 flex items-center justify-between gap-3 text-[13px] text-[#94A3B8]">
              <span>{progressLabelLeft}</span>
              <span>{progressLabelRight}</span>
            </div>
          )}

          <div className="h-2 rounded-full bg-[#E9EEF8]">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${Math.max(0, Math.min(progressValue, 100))}%`,
                backgroundColor: accent,
              }}
            />
          </div>
        </div>

        {(footerLabel || footerValue) && (
          <div className="mt-5 flex items-center gap-2 text-[14px] text-[#7B8AA4]">
            {footerValue && (
              <span
                className="inline-flex rounded-full px-2 py-0.5 text-[13px] font-semibold"
                style={{ backgroundColor: softAccent, color: accent }}
              >
                {footerValue}
              </span>
            )}
            {footerLabel && <span>{footerLabel}</span>}
          </div>
        )}
      </div>
    </article>
  );
};
