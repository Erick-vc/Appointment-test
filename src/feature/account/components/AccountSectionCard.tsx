import { cn } from "@lib/utils";
import type { ReactNode } from "react";

interface AccountSectionCardProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const AccountSectionCard = ({
  title,
  subtitle,
  actions,
  children,
  className,
}: AccountSectionCardProps) => {
  return (
    <section
      className={cn(
        "rounded-[24px] border border-white/70 bg-white p-6 shadow-[0_18px_45px_rgba(64,87,144,0.12)]",
        className
      )}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[18px] font-semibold text-[#1F2A44]">{title}</h3>
          {subtitle && <p className="mt-1 text-[14px] text-[#60708A]">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
};
