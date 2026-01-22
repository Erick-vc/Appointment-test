import { ChevronLeft, ChevronRight } from "@assets/icons";
import { collapsedStore } from "@lib/stores/collapsedStore";
import { Menu } from "./Menu";

export const Sidebar = () => {


    const { isSidebarCollapsed, setIsSidebarCollapsed } = collapsedStore()

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <aside className="row-span-2 border-r bg-slate-50 px-4 relative transition-all duration-300 overflow-hidden">
            {!isSidebarCollapsed && (
                <div className="p-4">
                    <p className="text-sm">Sidebar</p>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className={`absolute top-4  bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 transition-colors z-10 ${isSidebarCollapsed ? "right-5" : "right-3"}`}
                aria-label={
                    isSidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"
                }
            >
                {isSidebarCollapsed ? (
                    <ChevronRight width={16} height={16} color="#4B5675" />
                ) : (
                    <ChevronLeft width={16} height={16} color="#4B5675" />
                )}
            </button>

            <div className={`overflow-hidden   ${isSidebarCollapsed ? "mt-[52px]" : "mt-0"}`}>
                <Menu />
            </div>
        </aside>
    );
};
