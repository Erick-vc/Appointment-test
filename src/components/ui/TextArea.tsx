import { forwardRef, useEffect, useRef, useState } from "react";
import type { Size, Variant } from "./style";
import { cn } from "@lib/utils";

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
    variant?: Variant;
    size?: Size;
    error?: string;
    className?: string;
    inputClassName?: string;
    outlined?: boolean;
    isFloatLabel?: boolean;
    placeholder?: string;
    label?: string;
    rows?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ variant = 'default', size = 'sm', error, disabled, className, inputClassName, outlined = true, isFloatLabel = false, placeholder, label, rows = 3, ...rest }, ref) => {
        const isError = Boolean(error);
        const isDisabled = Boolean(disabled);

        // Estados para manejar el label flotante
        const [isFocused, setIsFocused] = useState(false);
        const [hasValue, setHasValue] = useState(Boolean(rest.value || rest.defaultValue));
        const containerRef = useRef<HTMLDivElement>(null);

        // Estados para los colores de fondo del floating label
        const [inputBgColor, setInputBgColor] = useState<string>('#FCFCFC');
        const [outerBgColor, setOuterBgColor] = useState<string>('white');

        // Actualizar hasValue cuando cambia el valor desde props
        useEffect(() => {
            setHasValue(Boolean(rest.value));
        }, [rest.value]);

        // Manejadores de eventos
        const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
            setIsFocused(true);
            if (rest.onFocus) {
                rest.onFocus(e);
            }
        };

        const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
            setIsFocused(false);
            if (rest.onBlur) {
                rest.onBlur(e);
            }
        };

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setHasValue(Boolean(e.target.value));
            if (rest.onChange) {
                rest.onChange(e);
            }
        };

        // Obtener el color de fondo externo para la parte superior del label
        useEffect(() => {
            if (containerRef.current) {
                const parent = containerRef.current.parentElement || document.body;
                const style = window.getComputedStyle(parent);
                const bg = style.backgroundColor || 'white';
                setOuterBgColor(bg === 'rgba(0, 0, 0, 0)' ? 'white' : bg);
            }
        }, []);

        // Determinar si el label debe flotar (cuando tiene foco o valor)
        const isLabelFloated = isFloatLabel && (isFocused || hasValue);

        return (
            <div className={cn('inline-flex flex-col relative', className)} ref={containerRef}>
                {isFloatLabel && label && (
                    <div
                        className={`absolute left-3 transition-all duration-500 ease-out pointer-events-none ${isLabelFloated
                            ? '-top-2 text-xs'
                            : 'top-4 text-sm text-gray-500 -translate-y-1/2'
                            }`}
                    >
                        {isLabelFloated ? (
                            <span
                                className="relative text-[9px] leading-[10px] px-1"
                                style={{
                                    color: isFocused ? '#6B7280' : '#6B7280',
                                    background: `linear-gradient(to bottom, ${outerBgColor} 0%, ${outerBgColor} 50%, ${inputBgColor} 50%, ${inputBgColor} 100%)`
                                }}
                            >
                                {label}
                            </span>
                        ) : (
                            <span className="text-[11px] text-gray-500">{label}</span>
                        )}
                    </div>
                )}

                <div className={`min-h-[54px] w-full border border-[#DBDFE9] rounded-lg px-[10px] py-2 bg-[#FCFCFC] transition-all duration-200 ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}>
                    <textarea
                        ref={ref}
                        disabled={isDisabled}
                        placeholder={isFocused ? placeholder : ''}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        rows={rows}
                        className="w-full outline-none bg-transparent text-[11px] resize-none border-none scroll-container"
                        {...rest}
                    />
                </div>
                {isError && <p className="mt-1 text-[11px] font-normal text-rose-500">{error}</p>}
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';
