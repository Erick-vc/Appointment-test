import { forwardRef, type ButtonHTMLAttributes } from "react";
import {
  getSizeClasses,
  getVariantClasses,
  type Size,
  type Variant,
} from "./style";
import { cn } from "@lib/utils";

export type ButtonProps = {
  className?: string;
  size?: Size;
  variant?: Variant;
  filled?: boolean;
  outlined?: boolean;
  ghost?: boolean;
  sizeIcon?: Size;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      size = "xs",
      variant = "default",
      filled = false,
      outlined = false,
      ghost = false,
      sizeIcon = "xs",
      loading = false,
      iconLeft,
      iconRight,
      disabled,
      onClick,
      children,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const sizeClasses = getSizeClasses(size, "button");

    const variantClasses = getVariantClasses({
      variant,
      outlined,
      filled,
      ghost,
      disabled: isDisabled,
      type: "button",
    });

    const baseClasses =
      "relative overflow-hidden flex items-center justify-center gap-1 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";

    const showSpinner = loading;

    let iconSizeClasses = "";
    switch (sizeIcon) {
      case "xs":
        iconSizeClasses = "w-3 h-3 flex-shrink-0";
        break;
      case "sm":
        iconSizeClasses = "w-4 h-4 flex-shrink-0";
        break;
      case "md":
        iconSizeClasses = "w-5 h-5 flex-shrink-0";
        break;
      case "lg":
        iconSizeClasses = "w-6 h-6 flex-shrink-0";
        break;
      default:
        iconSizeClasses = "w-5 h-5 flex-shrink-0";
        break;
    }

    const renderButton = () => {
      return (
        <button
          ref={ref}
          type={"button"}
          className={cn(
            baseClasses,
            variantClasses,
            sizeClasses,
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          onClick={onClick}
          disabled={isDisabled}
          aria-busy={loading}
          aria-disabled={isDisabled}
          {...rest}
        >
          <div className={cn("contents", "flex items-center gap-[6px]")}>
            {showSpinner ? (
              <span
                aria-hidden="true"
                className={cn(
                  iconSizeClasses,
                  "rounded-full border-2 border-current animate-spin border-t-transparent"
                )}
              />
            ) : (
              iconLeft && (
                <span
                  className={cn(
                    "flex justify-center items-center",
                    iconSizeClasses,
                    children ? "" : ""
                  )}
                >
                  {iconLeft}
                </span>
              )
            )}
            {children}
            {!showSpinner && iconRight && (
              <span
                className={cn(
                  "flex justify-center items-center",
                  iconSizeClasses,
                  children ? "" : ""
                )}
              >
                {iconRight}
              </span>
            )}
          </div>
        </button>
      );
    };

    return <div className={`${cn("relative group")}`}>{renderButton()}</div>;
  }
);

Button.displayName = "Button";
