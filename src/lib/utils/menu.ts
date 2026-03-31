export type MenuItem = {
  id: number;
  title: string;
  icon: "home" | "calendar" | "user" | "settings";
  route?: string;
  badge?: number;
};

export type MenuSection = {
  id: string;
  title: string;
  items: MenuItem[];
};

export const menuList: MenuSection[] = [
  {
    id: "general",
    title: "GENERAL",
    items: [
      {
        id: 1,
        title: "Estadisticas",
        icon: "home",
        route: "/estadisticas",
      },
      {
        id: 2,
        title: "Citas",
        icon: "calendar",
        route: "/citas",
      },
    ],
  },
  {
    id: "account",
    title: "CUENTA",
    items: [
      {
        id: 3,
        title: "Perfil",
        icon: "user",
        route: "/perfil",
      },
      {
        id: 4,
        title: "Configuracion",
        icon: "settings",
      },
    ],
  },
];
