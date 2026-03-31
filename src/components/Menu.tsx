import { collapsedStore } from "@lib/stores/collapsedStore";
import { cn } from "@lib/utils";
import { menuList } from "@lib/utils/menu";
import { useLocation, useNavigate } from "react-router-dom";

type IconProps = {
  active?: boolean;
};

const iconClassName = (active?: boolean) =>
  cn("h-[18px] w-[18px]", active ? "text-[#3f72ff]" : "text-[#7f8aa3]");

const HomeIcon = ({ active }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={iconClassName(active)}>
    <path
      d="M3 10.75L12 3l9 7.75"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.25 9.75v9.5h13.5v-9.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = ({ active }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={iconClassName(active)}>
    <rect
      x="3.75"
      y="5.75"
      width="16.5"
      height="14.5"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M8 3.75v4M16 3.75v4M3.75 10.25h16.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const UserIcon = ({ active }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={iconClassName(active)}>
    <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M5.5 19.25a6.5 6.5 0 0113 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const SettingsIcon = ({ active }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={iconClassName(active)}>
    <path
      d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M19.4 13.5a1.2 1.2 0 00.24 1.33l.05.05a1.45 1.45 0 01-1.02 2.47 1.45 1.45 0 01-1.03-.43l-.05-.05a1.2 1.2 0 00-1.33-.24 1.2 1.2 0 00-.73 1.1V18a1.45 1.45 0 11-2.9 0v-.07a1.2 1.2 0 00-.79-1.14 1.2 1.2 0 00-1.33.24l-.05.05a1.45 1.45 0 01-2.06 0 1.45 1.45 0 010-2.04l.05-.05a1.2 1.2 0 00.24-1.33 1.2 1.2 0 00-1.1-.73H6a1.45 1.45 0 110-2.9h.07a1.2 1.2 0 001.14-.79 1.2 1.2 0 00-.24-1.33l-.05-.05a1.45 1.45 0 010-2.06 1.45 1.45 0 012.04 0l.05.05a1.2 1.2 0 001.33.24h.06A1.2 1.2 0 0011.1 4.8V4.7a1.45 1.45 0 112.9 0v.07a1.2 1.2 0 00.79 1.14 1.2 1.2 0 001.33-.24l.05-.05a1.45 1.45 0 012.06 0 1.45 1.45 0 010 2.04l-.05.05a1.2 1.2 0 00-.24 1.33v.06a1.2 1.2 0 001.1.72H20a1.45 1.45 0 110 2.9h-.07a1.2 1.2 0 00-1.14.79z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const iconMap = {
  home: HomeIcon,
  calendar: CalendarIcon,
  user: UserIcon,
  settings: SettingsIcon,
};

export const Menu = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isSidebarCollapsed } = collapsedStore();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <div className={cn("flex flex-col", isSidebarCollapsed ? "gap-5" : "gap-8")}>
      {menuList.map((section, index) => (
        <section key={section.id} className="flex flex-col gap-3">
          {isSidebarCollapsed ? (
            <div className="h-[13px] flex items-center">
              {index > 0 && <p className="h-px mx-3 w-full bg-[#edf1f7]"></p>}
            </div>
          ) : (
            <div className="h-[13px] px-3">
              <p className="overflow-hidden whitespace-nowrap text-[11px] font-bold tracking-[0.22em] text-[#a4aec4]">
                {section.title}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            {section.items.map((item) => {
              const isActive = item.route ? pathname.startsWith(item.route) : false;
              const IconComponent = iconMap[item.icon];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => item.route && handleNavigate(item.route)}
                  disabled={!item.route}
                  className={cn(
                    "group flex min-h-[44px] w-full items-center rounded-[14px] text-left transition-colors",
                    isActive
                      ? "border border-[#b7cdff] bg-[#edf3ff]"
                      : "border border-transparent hover:bg-[#f6f8fc]",
                    !item.route && "cursor-default opacity-70",
                    "gap-2.5 px-2 py-2"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]",
                      isActive ? "bg-white" : "bg-transparent group-hover:bg-white"
                    )}
                  >
                    <IconComponent active={isActive} />
                  </span>
                  <span
                    className={cn(
                      "flex min-w-0 flex-1 items-center justify-between gap-3 overflow-hidden transition-[width,opacity] duration-200 ease-out",
                      isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}
                  >
                    <span
                      className={cn(
                        "truncate text-[15px] font-medium leading-none",
                        isActive ? "text-[#3f72ff]" : "text-[#51607a]"
                      )}
                    >
                      {item.title}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};
