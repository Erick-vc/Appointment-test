import { collapsedStore } from "@lib/stores/collapsedStore";
import { menuList } from "@lib/utils/menu";
import { useNavigate } from "react-router-dom";



export const Menu = () => {
  const navigate = useNavigate();
  const { isSidebarCollapsed } = collapsedStore()

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <div className={`flex flex-col gap-2`}>
      {menuList.map((item) => {

        const IconComponent = item.icon;

        return (
          <div
            key={item.id}
            onClick={() => handleNavigate(item.route)}
            className={`flex items-center gap-3 p-2 rounded-md hover:bg-slate-200 cursor-pointer transition-colors `}
          >
            {IconComponent && (
              <IconComponent width={20} height={20} color="#4B5675" className="min-w-5" />
            )}
            <span
              className={`text-sm text-[#4B5675] font-medium whitespace-nowrap overflow-hidden transition-all ${isSidebarCollapsed
                ? "transition-all duration-300 opacity-0 scale-95"
                : "transition-all duration-300 opacity-100 scale-100"
                }`}
            >
              {item.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
