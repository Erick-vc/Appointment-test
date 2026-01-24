import { DashboardIcon, FolderMinus, UserIcon } from "@assets/icons";

export const menuList = [
  {
    id: 1,
    title: "Estadísticas",
    icon: DashboardIcon,
    route: "/estadisticas",
  },
  {
    id: 2,
    title: "Citas",
    icon: FolderMinus,
    route: "/citas",
  },
  {
    id: 3,
    title: "Perfil",
    icon: UserIcon,
    route: "/perfil",
  },
];
