import type { TModal } from "@lib/types";
import { create } from "zustand";

interface ModalState {
  modals: TModal[];
  isCloseBackground: boolean;
  showModal: (modal: TModal) => void;
  hideModal: () => void;
  hideAllModals: () => void;
  setIsCloseBackground: (value: boolean) => void;
}

export const useModalStore = create<ModalState>((set, _) => ({
  modals: [],
  isCloseBackground: true,

  showModal: (modal) =>
    set((state) => {
      const modalType =
        (modal.content as any)?.type?.name ||
        (modal.content as any)?.type?.displayName;
      if (modalType) {
        const existingModalOfSameType = state.modals.find((m) => {
          const existingType =
            (m.content as any)?.type?.name ||
            (m.content as any)?.type?.displayName;
          return existingType === modalType;
        });

        if (existingModalOfSameType) {
          return state;
        }
      }

      return {
        modals: [...state.modals, modal],
      };
    }),

  hideModal: () =>
    set((state) => {
      const newModals = [...state.modals];
      const lastModal = newModals.pop();

      if (lastModal?.onClosedCallback) {
        lastModal.onClosedCallback();
      }

      return { modals: newModals };
    }),

  hideAllModals: () =>
    set((state) => {
      state.modals.forEach((modal) => {
        if (modal.onClosedCallback) {
          modal.onClosedCallback();
        }
      });

      return { modals: [] };
    }),

  setIsCloseBackground: (value) => set({ isCloseBackground: value }),
}));
