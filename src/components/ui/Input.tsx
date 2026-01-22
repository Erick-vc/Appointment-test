import { cn } from '@lib/utils';
import * as React from 'react';
import type { Size, Variant } from './style';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    variant?: Variant;
    size?: Size;
    error?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    className?: string;
    inputClassName?: string;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    outlined?: boolean;
    isFloatLabel?: boolean;
    placeholder?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ variant = 'default', size = 'sm', error, disabled, prefix, suffix, className, inputClassName, iconLeft, iconRight, outlined = true, isFloatLabel = false, placeholder, ...rest }, ref) => {
        const isError = Boolean(error);
        const isDisabled = Boolean(disabled);

        // Estados para manejar el label flotante
        const [isFocused, setIsFocused] = React.useState(false);
        const [hasValue, setHasValue] = React.useState(Boolean(rest.value || rest.defaultValue));
        const containerRef = React.useRef<HTMLDivElement>(null);

        // Estados para los colores de fondo del floating label
        const [inputBgColor, setInputBgColor] = React.useState<string>('#FCFCFC');
        const [outerBgColor, setOuterBgColor] = React.useState<string>('white');

        // Actualizar hasValue cuando cambia el valor desde props
        React.useEffect(() => {
            setHasValue(Boolean(rest.value || rest.defaultValue));
        }, [rest.value, rest.defaultValue]);

        // Manejadores de eventos
        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            if (rest.onFocus) {
                rest.onFocus(e);
            }
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            if (rest.onBlur) {
                rest.onBlur(e);
            }
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setHasValue(Boolean(e.target.value));
            if (rest.onChange) {
                rest.onChange(e);
            }
        };

        // Obtener el color de fondo externo para la parte superior del label
        React.useEffect(() => {
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
            <div className={cn('inline-flex relative flex-col', className)} ref={containerRef}>
                {isFloatLabel && placeholder && (
                    <div
                        className={`absolute left-3 transition-all duration-500 ease-out pointer-events-none ${isLabelFloated
                            ? '-top-2 text-xs'
                            : 'top-1/2 text-sm text-gray-500 -translate-y-1/2'
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
                                {placeholder}
                            </span>
                        ) : (
                            <span className="text-[11px] text-gray-500">{placeholder}</span>
                        )}
                    </div>
                )}

                <div className={`min-h-[34px] flex items-center w-full border border-[#DBDFE9] rounded-lg px-[10px] py-1 bg-[#FCFCFC] transition-all duration-200 ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''} ${inputClassName}`}>
                    {prefix && <span className="shrink-0 mr-2">{prefix}</span>}
                    <input
                        ref={(el) => {
                            if (ref && 'current' in ref) {
                                (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
                            }

                            if (typeof ref === 'function') {
                                ref(el);
                            } else if (ref) {
                                ref.current = el;
                            }
                        }}
                        disabled={isDisabled}
                        placeholder={isFloatLabel ? '' : placeholder}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        className="outline-none w-full bg-transparent text-[11px] border-none"
                        {...rest}
                    />

                    {suffix && <span className="shrink-0 ml-2">{suffix}</span>}
                </div>
                {isError && <p className="mt-1 text-[11px] font-normal text-rose-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
