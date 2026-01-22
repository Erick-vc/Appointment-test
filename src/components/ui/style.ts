// Utilidades de estilos centralizadas para branding de Flujolink UI

export type Variant =
  | "primary"
  | "success"
  | "secondary"
  | "default"
  | "danger"
  | "warning"
  | "light"
  | "info";
export type Size = "xs" | "sm" | "md" | "lg";

interface VariantClassesProps {
  variant: Variant;
  outlined: boolean;
  filled: boolean;
  ghost?: boolean;
  disabled: boolean;
  type: "input" | "button" | "select" | "dropdown" | "badge";
}

export function getVariantClasses({
  variant = "default",
  outlined = false,
  filled = false,
  ghost = false,
  disabled = false,
  type = "input",
}: VariantClassesProps) {
  // if (disabled) {
  //     switch (variant) {
  //         case 'primary':
  //             return 'opacity-50 cursor-not-allowed';
  //     }
  //     return 'bg-stone-50 border border-zinc-200 text-slate-300 placeholder-slate-300 cursor-not-allowed';
  // }
  if (filled) {
    switch (variant) {
      case "primary":
        return `bg-[#1B84FF] border border-[#1B84FF] text-white placeholder-blue-200 ${
          type !== "badge" ? "hover:bg-blue-500" : ""
        } focus:ring-blue-500`;
      case "success":
        return `bg-green-500 border border-green-500 text-white placeholder-green-200 ${
          type !== "badge" ? "hover:bg-green-600" : ""
        } focus:ring-green-600`;
      case "secondary":
        return `bg-gray-600 border border-gray-600 text-white placeholder-gray-200 ${
          type !== "badge" ? "hover:bg-gray-700" : ""
        } focus:ring-gray-500`;
      case "danger":
        return `bg-red-500 border border-red-500 text-white placeholder-red-200 ${
          type !== "badge" ? "hover:bg-red-600" : ""
        } focus:ring-red-500`;
      case "warning":
        return `bg-yellow-500 border border-yellow-500 text-white placeholder-yellow-200 ${
          type !== "badge" ? "hover:bg-yellow-600" : ""
        } focus:ring-yellow-500`;
      case "light":
        return `font-medium text-[#4B5675] focus:outline-none bg-[#F9F9F9] rounded-lg border border-gray-200  focus:z-10 focus:ring-gray-400`;
      case "default":
      default:
        return `bg-gray-800 border border-gray-800 text-white placeholder-gray-200 ${
          type !== "badge" ? "hover:bg-gray-900" : ""
        } focus:ring-gray-400`;
    }
  } else if (outlined) {
    switch (variant) {
      case "primary":
        return `bg-[#EFF6FF] border border-[#1B84FF33] text-[#1B84FF] placeholder-blue-400 ${
          type !== "badge" ? "hover:bg-blue-50" : ""
        } focus:ring-blue-500`;
      case "success":
        return `bg-green-50 border border-green-500 text-green-500 placeholder-green-400 ${
          type !== "badge"
            ? "hover:bg-green-50"
            : "bg-[#EAFFF1] border-[#17C65333] text-[#04B440]"
        } focus:ring-green-600`;
      case "secondary":
        return `bg-gray-50 border border-gray-600 text-gray-600 placeholder-gray-400 ${
          type !== "badge"
            ? "hover:bg-gray-50"
            : "bg-[#F9F9F9] border-[#DBDFE9] text-[#78829D]"
        } focus:ring-gray-500`;
      case "danger":
        return `bg-red-50 border border-red-600 text-red-600 placeholder-red-400 ${
          type !== "badge"
            ? "hover:bg-red-50"
            : "bg-[#FFEEF3] border-[#F8285A33] text-[#D81A48]"
        } focus:ring-red-500`;
      case "warning":
        return `bg-yellow-50 border border-yellow-500 text-yellow-500 placeholder-yellow-400 ${
          type !== "badge" ? "hover:bg-yellow-50" : ""
        } focus:ring-yellow-500`;
      case "default":
      default:
        return `bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 ${
          type !== "badge" ? "hover:bg-gray-50" : ""
        } focus:ring-gray-400`;
    }
  } else if (ghost) {
    return `bg-transparent border-0 text-[#4B5675] placeholder-gray-400`;
  } else {
    switch (variant) {
      case "primary":
        return `bg-blue-50 text-blue-700 placeholder-blue-400 ${
          type !== "badge" ? "hover:bg-blue-100" : ""
        } focus:ring-blue-500`;
      case "success":
        return `bg-green-50 text-green-700 placeholder-green-400 ${
          type !== "badge" ? "hover:bg-green-100" : ""
        } focus:ring-green-600`;
      case "secondary":
        return `bg-gray-50 text-gray-700 placeholder-gray-400 ${
          type !== "badge" ? "hover:bg-gray-50" : ""
        } focus:ring-gray-500`;
      case "danger":
        return `bg-red-50 text-red-700 placeholder-red-400 ${
          type !== "badge" ? "hover:bg-red-100" : ""
        } focus:ring-red-500`;
      case "warning":
        return `bg-yellow-50 text-yellow-700 placeholder-yellow-400 ${
          type !== "badge" ? "hover:bg-yellow-100" : ""
        } focus:ring-yellow-500`;
      case "default":
      default:
        return `bg-white text-gray-800 placeholder-gray-400 ${
          type !== "badge" ? "hover:bg-gray-50" : ""
        } focus:ring-gray-400`;
    }
  }
}

export function getSizeClasses(
  size: Size = "xs",
  type: "input" | "button" | "select" | "dropdown" | "badge" = "input"
) {
  switch (size) {
    case "xs":
      return type === "button"
        ? "text-xs px-[10px] py-[9px]"
        : "px-[6px] py-[5px] text-xs";
    case "sm":
      return type === "button"
        ? "text-sm px-[14px] py-2"
        : "px-2.5 py-2 text-xs";
    case "md":
      return type === "button" ? "text-sm px-4 py-2" : "px-3 py-2.5 text-sm";
    case "lg":
      return type === "button"
        ? "text-base px-5 py-2.5"
        : "px-3.5 py-3 text-base";
    default:
      return type === "button" ? "text-sm px-4 py-2" : "px-3 py-2.5 text-sm";
  }
}
