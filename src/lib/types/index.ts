import type { ReactNode } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type TUserLoing = {
  username: string;
  password: string;
};

export type TUserRegister = {
  username: string;
  password: string;
  confirmPassword: string;
};

export type TToastProps = {
  message: string;
  subMessage?: string;
  iconType: "success" | "error" | "warning";
  actionUrl?: { label: string; url?: string; handleButton?: () => void };
  width?: string;
};

export type TColumnsTable<T> = {
  name: string;
  type: string;
  key: Extract<keyof T, string>;
  subType?: string;
  render?: (value: any, row: T) => React.ReactNode;
  initialWidth?: number;
};



export type TModal = {
  content: ReactNode;
  modalClassName?: string;
  contentClassName?: string;
  contentTitleClassName?: string;
  onClosedCallback?: () => void;
  nonBlocking?: boolean;
  position?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  width?: string;
  height?: string;
  showCloseButton?: boolean;
  title?: string | React.JSX.Element;
  showHeader?: boolean;
  slideFrom?: "right" | "left" | "top" | "bottom";
  closeOnOutsideClick?: boolean;
  modalId?: string;
  modalIdentifier?: string;
  parentModalIdentifier?: string;
  elementId?: number | string;
};
