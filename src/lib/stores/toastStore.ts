// src/stores/toastStore.ts

import { create } from "zustand";
import type { TToastProps } from "../types";

interface ToastState extends TToastProps {
  trigger: boolean;
  lastMessage: string;
  lastMessageTime: number;
  showToast: (data: TToastProps) => void;
  resetToast: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  message: "",
  subMessage: "",
  iconType: "success",
  actionUrl: undefined,
  width: undefined,
  trigger: false,
  lastMessage: "",
  lastMessageTime: 0,

  showToast: (data) => {
    const currentState = get();
    const newMessageKey = `${data.message}-${data.iconType}`;
    const now = Date.now();
    const timeDifference = now - currentState.lastMessageTime;

    if (currentState.lastMessage === newMessageKey && timeDifference < 2000) {
      return;
    }

    set({
      ...data,
      iconType: data.iconType ?? "success",
      trigger: true,
      lastMessage: newMessageKey,
      lastMessageTime: now,
    });
  },

  resetToast: () =>
    set({
      message: "",
      subMessage: "",
      iconType: "success",
      actionUrl: undefined,
      width: undefined,
      trigger: false,
      lastMessage: "",
      lastMessageTime: 0,
    }),
}));
