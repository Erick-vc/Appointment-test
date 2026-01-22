import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (value: boolean) => void;
};

export const collapsedStore = create<UserState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      setIsSidebarCollapsed: (value: boolean) =>
        set({ isSidebarCollapsed: value }),
    }),
    {
      name: "collapsed",
    }
  )
);
         