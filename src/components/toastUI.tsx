// src/components/Toast/index.tsx
import { CloseIcon, DangerToast } from "@assets/icons";
import { useToastStore } from "@lib/stores/toastStore";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export const ToastUI = () => {
  const { message, subMessage, iconType, width, trigger, resetToast } =
    useToastStore();
  const icons = {
    success: DangerToast,
    error: DangerToast,
    warning: DangerToast,
  };
  const Icon = icons[iconType ?? "success"];


  const notify = () => {
    toast.custom(
      (t) => (
        <div
          role="alert"
          style={width ? { width } : undefined}
          className={`${t.visible ? "animate-enter" : "animate-leave"}
                      min-w-[280px] w-full max-w-max rounded-xl pointer-events-auto
                      bg-[#FFFFFF] shadow-[0_4px_12px_0_rgba(0,0,0,0.07)]
                      flex items-center p-4 gap-4 
                      hover:bg-[#F9F9F9] border-[#F1F1F4]
                      `}
        >
          <Icon color="#252F4A" width={40} height={40} />
          <div className="flex items-center gap-3 w-full justify-between">
            <div className="flex-1 flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <p
                  className={`text-[14px] font-semibold leading-[14px] text-[#252F4A]`}
                >
                  {message}
                </p>
                {subMessage && (
                  <p
                    className={`text-[13px] font-medium leading-[14px] text-[#78829D]`}
                  >
                    {subMessage}
                  </p>
                )}
              </div>
            </div>
            <div
              onClick={() => {
                toast.dismiss(t.id);
                console.log("xd");
              }}
              className="p-[6px] cursor-pointer"
            >
              <CloseIcon color="#78829D" width={16} height={16} />
            </div>
          </div>
        </div>
      ),
      { duration: 4000, position: "top-right" }
    );
    /* Reseteamos el gatillo */
    setTimeout(() => resetToast(), 100);
  };

  useEffect(() => {
    if (trigger) notify();
  }, [trigger]); // se dispara cuando trigger pasa a true

  return <Toaster />;
};
