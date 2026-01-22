import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  user_id: number;
  username: string;
};

type UserState = AuthPayload & {
  setAuth: (data: AuthPayload) => void;
  clearAuth: () => void;
};

const initialState: AuthPayload = {
  accessToken: "",
  refreshToken: "",
  user_id: 0,
  username: "",
};

export const userStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setAuth: (data) => set({ ...data }),

      clearAuth: () => set(initialState),
    }),
    {
      name: "user",
    }
  )
);
