interface DashboardDataBadgeProps {
  active: boolean;
  trueLabel?: string;
  falseLabel?: string;
}

export const DashboardDataBadge = ({
  active,
  trueLabel = "data true",
  falseLabel = "data false",
}: DashboardDataBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ${
        active
          ? "bg-[#E8F8F0] text-[#0C9F6A]"
          : "bg-[#FFF1F2] text-[#E11D48]"
      }`}
    >
      {active ? trueLabel : falseLabel}
    </span>
  );
};
