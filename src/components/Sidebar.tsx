import { ChevronLeft, ChevronRight } from "@assets/icons";
import { collapsedStore } from "@lib/stores/collapsedStore";
import { userStore } from "@lib/stores/userStore";
import { cn } from "@lib/utils";
import { Menu } from "./Menu";

const BrandMark = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" />
        <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" opacity="0.82" />
        <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" opacity="0.82" />
        <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" />
    </svg>
);

export const Sidebar = () => {
    const { isSidebarCollapsed, setIsSidebarCollapsed } = collapsedStore();
    const { username } = userStore();

    const displayName = username || "Usuario";
    const initials = displayName.trim().charAt(0).toUpperCase() || "U";

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <aside
            className={cn(
                "relative row-span-2 flex h-full flex-col overflow-hidden border-r border-[#e6ebf5] bg-white transition-[padding] duration-200 ease-out",
                isSidebarCollapsed ? "px-4 py-5" : "px-5 py-5"
            )}
        >
            <button
                onClick={toggleSidebar}
                className={cn(
                    "absolute top-8 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe3f2] bg-white shadow-sm transition-[right,background-color] duration-200 ease-out hover:bg-[#f7f9fd]",
                    isSidebarCollapsed ? "right-3" : "right-5"
                )}
                aria-label={isSidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
                {isSidebarCollapsed ? (
                    <ChevronRight width={16} height={16} color="#60708a" />
                ) : (
                    <ChevronLeft width={16} height={16} color="#60708a" />
                )}
            </button>

            <div className="flex h-full flex-col">
                <div className={`flex items-center  border-b pb-4 border-[#edf1f7] ${isSidebarCollapsed ? "" : "justify-start gap-3"}`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4b7bff_0%,#6d43f3_100%)] text-white shadow-[0_18px_38px_rgba(81,106,255,0.22)]">
                        <BrandMark />
                    </div>
                    <div
                        className={cn(
                            "min-w-0 overflow-hidden whitespace-nowrap transition-[width,opacity] duration-200 ease-out",
                            isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                        )}
                    >
                        <p className="text-[29px] leading-none font-semibold text-[#14306a]">
                            Villa<span className="text-[#3f72ff]">Citas</span>
                        </p>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto py-8">
                    <Menu />
                </div>

                <div className="flex min-h-[68px] items-center gap-3 border-t border-[#edf1f7] pt-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#4b7bff_0%,#6d43f3_100%)] text-sm font-semibold text-white">
                        {initials}
                    </div>
                    <div
                        className={cn(
                            "min-w-0 flex-1 overflow-hidden transition-[width,opacity] duration-200 ease-out",
                            isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                        )}
                    >
                        <p className="truncate text-base font-semibold text-[#1a2b49]">
                            {displayName}
                        </p>
                        <p className="text-sm text-[#94a0b5]">Administrador</p>
                    </div>
                    <span
                        className={cn(
                            "shrink-0 transition-[width,opacity] duration-200 ease-out",
                            isSidebarCollapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"
                        )}
                    >
                        <ChevronRight width={16} height={16} color="#94a0b5" />
                    </span>
                </div>
            </div>
        </aside>
    );
};
