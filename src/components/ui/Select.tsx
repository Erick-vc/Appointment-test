import { ArrowDown } from '@assets/icons';
import { useDropdownLock } from '@lib/hooks/useDropdownLock';
import { cn } from '@lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import ImageWithFallback from './Image';
import type { Size, Variant } from './style';

export interface OptionSelect {
    id: string;
    label: string | React.JSX.Element;
    icon?: string | null;
    subValue?: string;
    textRight?: string;
}

export interface SelectProps {
    // Value and onChange
    value?: string | string[] | null;
    onChange?: (value: string | string[]) => void;
    options: OptionSelect[];

    // UI Props
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    outlined?: boolean;
    placeholder?: string;
    error?: string;

    // Feature Props
    searchable?: boolean;
    searchBy?: keyof OptionSelect;
    searchPlaceholder?: string;
    multiSelect?: boolean;
    className?: string;
    iconRight?: React.ReactNode;
    iconLeft?: React.ReactNode;
    isFloatLabel?: boolean; // Add floating label option
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
    (
        {
            value: externalValue,
            onChange: externalOnChange,
            options,
            variant = 'default',
            size = 'sm',
            disabled = false,
            outlined = true,
            placeholder = 'Select an option',
            error,
            searchable = true,
            searchBy = 'label',
            searchPlaceholder = 'Buscar...',
            multiSelect = false,
            className = "h-[32px]",
            iconRight,
            isFloatLabel = false,
            iconLeft
        },
        ref
    ) => {
        // Internal state management
        const [internalValue, setInternalValue] = useState<string | string[] | null>(null);


        // Use external value if provided, otherwise use internal state
        const value = externalValue !== undefined ? externalValue : internalValue;

        const handleChange = (newValue: string | string[]) => {
            if (externalOnChange) {
                externalOnChange(newValue);
            } else {
                setInternalValue(newValue);
            }
        };
        const [open, setOpen] = useState(false);
        const { wrapDropdown } = useDropdownLock({ open, onClose: () => setOpen(false) });
        const [searchTerm, setSearchTerm] = useState('');
        const selectRef = useRef<HTMLDivElement>(null);
        const dropdownRef = useRef<HTMLDivElement>(null);
        const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});
        const inputSearchRef = useRef<HTMLInputElement>(null);
        const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
        const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number; width: number } | null>(null);
        // Ref del control para obtener el color de fondo real y aplicarlo al label flotante
        const controlRef = useRef<HTMLDivElement | null>(null);
        const [selectBgColor, setSelectBgColor] = useState<string>('#FCFCFC');
        const [outerBgColor, setOuterBgColor] = useState<string>('white');

        const isError = Boolean(error);
        const isDisabled = Boolean(disabled);



        // Filter options based on search term and searchBy
        const extractTextFromReactNode = (node: React.ReactNode): string => {
            if (node == null || typeof node === "boolean") return "";
            if (typeof node === "string" || typeof node === "number") return String(node);
            if (Array.isArray(node)) return node.map(extractTextFromReactNode).join(" ");

            if (React.isValidElement(node)) {
                const el = node as React.ReactElement<{ children?: React.ReactNode }>;
                return extractTextFromReactNode(el.props.children);
            }

            return "";
        };


        const filteredOptions = searchable
            ? options?.filter((option) => {
                const raw = option[searchBy] as unknown;
                const textValue = typeof raw === 'string' ? raw : extractTextFromReactNode(raw as React.ReactNode);
                return textValue.toLowerCase().includes(searchTerm.toLowerCase());
            })
            : options;

        const handleSelect = (option: OptionSelect) => {
            if (isDisabled) return;

            if (multiSelect) {
                const currentValue = Array.isArray(value) ? value : [];
                const isSelected = currentValue.includes(option.id);
                const newValue = isSelected ? currentValue?.filter((id) => id !== option.id) : [...currentValue, option.id];
                handleChange(newValue);
            } else {
                handleChange(option.id);
                setOpen(false);
                setSearchTerm('');
            }
        };

        const handleRemove = (optionId: string, e: React.MouseEvent) => {
            e.stopPropagation();
            if (multiSelect && Array.isArray(value)) {
                handleChange(value?.filter((id) => id !== optionId));
            }
        };


        // Calcular posición del dropdown (arriba o abajo) basado en el espacio disponible
        // Se calcula una sola vez al abrir para evitar pestañeo
        useEffect(() => {
            if (open && selectRef.current) {
                const rect = selectRef.current.getBoundingClientRect();
                const dropdownHeight = 200; // maxHeight del dropdown
                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;

                // Si no hay suficiente espacio abajo pero sí arriba, posicionar arriba
                const position = (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) ? 'top' : 'bottom';
                setDropdownPosition(position);

                // Calcular y guardar las coordenadas una sola vez
                const estimatedHeight = Math.min(200, (filteredOptions?.length || 1) * 36);
                const top = position === 'bottom'
                    ? rect.bottom + window.scrollY
                    : rect.top + window.scrollY - estimatedHeight;

                setDropdownCoords({
                    top,
                    left: rect.left + window.scrollX,
                    width: rect.width
                });

                setDropdownStyles({
                    position: 'absolute',
                    left: 0,
                    width: '100%',
                    zIndex: 9999,
                    maxHeight: '200px',
                });
            } else {
                setSearchTerm('');
                setDropdownCoords(null);
            }
        }, [open]);

        // Obtener el color de fondo aplicado al control para usarlo en el label flotante
        useEffect(() => {
            const timer = setTimeout(() => {
                if (controlRef.current) {
                    const style = window.getComputedStyle(controlRef.current);
                    const bg = style.backgroundColor || 'white';
                    // Si es transparente, usamos white como fallback
                    setSelectBgColor(bg === 'rgba(0, 0, 0, 0)' ? 'white' : bg);
                }
            }, 50);

            return () => clearTimeout(timer);
        }, [variant, outlined]);

        // Obtener el color de fondo externo (del contenedor padre o body) para el overlay superior del label
        useEffect(() => {
            const timer = setTimeout(() => {
                const parent = selectRef.current?.parentElement || document.body;
                const style = window.getComputedStyle(parent);
                const bg = style.backgroundColor || 'white';
                setOuterBgColor(bg === 'rgba(0, 0, 0, 0)' ? 'white' : bg);
            }, 50);

            return () => clearTimeout(timer);
        }, []);

        useEffect(() => {
            if (open && searchable && inputSearchRef.current) {
                inputSearchRef.current.focus();
            }
        }, [open, searchable]);

        const renderSelectedValue = () => {
            if (!value || (Array.isArray(value) && value?.length === 0)) {
                return isFloatLabel ? <span></span> : <span className="text-gray-500 text-[11px]">{placeholder}</span>;
            }

            if (multiSelect && Array.isArray(value)) {
                return (
                    <div className="flex flex-wrap gap-1">
                        {value.map((id) => {

                            const option = Array.isArray(options) ? options.find((opt) => opt.id === id) : null;
                            if (!option) return null;
                            return (
                                <div key={id} className="bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                                    {option.icon && <ImageWithFallback src={option.icon} alt={option.label as string} className="w-4 h-4" />}
                                    <span className="text-xs">{option.label}</span>
                                    <button type="button" onClick={(e) => handleRemove(id, e)} className="text-gray-500 hover:text-gray-700">
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                );
            }

            const selectedOption = options.find((opt) => opt.id === value);
            if (!selectedOption) return null;

            return (
                <div className="flex gap-2 items-center truncate font-inter">
                    {selectedOption.icon && <ImageWithFallback src={selectedOption.icon} alt={selectedOption.label as string} className="w-5 h-5" />}
                    <div className="truncate text-[11px]">
                        <span className="truncate">{selectedOption.label}</span>
                        {selectedOption.subValue && <span className="block text-xs text-gray-500">{selectedOption.subValue}</span>}
                    </div>
                </div>
            );
        };

        // En vez de renderSelectedValue, renderiza el input si está abierto y searchable
        const renderMainArea = () => {
            if (open && searchable) {
                return (
                    <input
                        ref={inputSearchRef}
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full outline-none bg-transparent text-[11px] border-none"
                        autoFocus
                    />
                );
            }
            return renderSelectedValue();
        };

        const isLabelFloated = ((value && !Array.isArray(value)) || (Array.isArray(value) && value?.length > 0) || open);

        const setCombinedRef = (el: HTMLDivElement | null) => {
            controlRef.current = el;
            if (typeof ref === 'function') {
                ref(el);
            }
            else if (ref && typeof ref === 'object' && 'current' in ref) {
                (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
            }
        };

        return (
            <div className={cn('relative', className)} ref={selectRef}>
                {isFloatLabel && (
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
                                    color: open ? '#6B7280' : '#6B7280',
                                    background: `linear-gradient(to bottom, ${outerBgColor} 0%, ${outerBgColor} 50%, ${selectBgColor} 50%, ${selectBgColor} 100%)`
                                }}
                            >
                                {placeholder}
                            </span>
                        ) : (
                            <span className="text-[11px] text-gray-500">{placeholder}</span>
                        )}
                    </div>
                )}
                <div
                    ref={setCombinedRef}
                    onClick={() => !isDisabled && setOpen(!open)}
                    className={`h-full w-full border border-[#DBDFE9] rounded-lg px-[10px] py-2 bg-[#FCFCFC] transition-all duration-200 flex items-center gap-1 justify-between cursor-pointer ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''} ${open && 'py-0'}`}
                >
                    <div className="flex items-center flex-1 gap-2 min-w-0">
                        {/* ICONO IZQUIERDO */}
                        {iconLeft && <div className="shrink-0">{iconLeft}</div>}

                        {/* Placeholder invisible para floating label + contenido */}
                        {isFloatLabel && (!value || (Array.isArray(value) && value?.length === 0)) && !open ? (
                            <span className="invisible text-[11px]">{placeholder}</span>
                        ) : (
                            renderMainArea()
                        )}
                    </div>

                    {iconRight ? (
                        iconRight
                    ) : (

                        <ArrowDown
                            width={16}
                            height={16}
                            stroke="#78829D"
                            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        />
                    )}
                </div>

                {isError && <p className="mt-1 text-xs text-rose-500">{error}</p>}

                {open && !isDisabled && dropdownCoords && ReactDOM.createPortal(wrapDropdown(
                    <div
                        data-select-dropdown="true"
                        ref={dropdownRef}
                        className={cn(
                            'fixed bg-white rounded-md shadow-lg outline-1 outline-gray-100 z-9999',
                            dropdownPosition === 'bottom' ? 'mt-1' : 'mb-1',
                            variant === 'default' ? 'border border-gray-200' : '',
                            variant === 'primary' ? 'border border-blue-100' : '',
                            variant === 'success' ? 'border border-green-100' : '',
                            variant === 'secondary' ? 'border border-gray-100' : '',
                            variant === 'danger' ? 'border border-red-100' : ''
                        )}
                        style={{
                            top: dropdownCoords.top,
                            left: dropdownCoords.left,
                            width: dropdownCoords.width,
                            maxHeight: '200px'
                        }}
                    >
                        <div className="max-h-[200px] overflow-auto scroll-container">
                            {filteredOptions?.length > 0 ? (
                                filteredOptions.map((option) => {
                                    const isSelected = Array.isArray(value) ? value.includes(option.id) : value === option.id;

                                    return (
                                        <div
                                            key={option.id}
                                            onClick={() => handleSelect(option)}
                                            className={cn(
                                                'px-3 py-2 cursor-pointer transition-colors duration-150',
                                                isSelected ? 'bg-gray-100' : 'hover:bg-gray-50',
                                                size === 'xs' ? 'text-xs' : '',
                                                size === 'sm' ? 'text-xs' : '',
                                                size === 'md' ? 'text-sm' : '',
                                                size === 'lg' ? 'text-base' : ''
                                            )}
                                        >
                                            <div className="flex gap-2 items-center truncate font-inter">
                                                {option.icon && <ImageWithFallback src={option.icon} alt={option.label as string} className="w-5 h-5" />}
                                                <div className="flex items-center w-full">
                                                    <div className="truncate w-full">
                                                        <span className="block truncate text-[#374151]">{option.label}</span>
                                                        {option.subValue && <span className="block text-xs text-gray-500">{option.subValue}</span>}
                                                    </div>
                                                    {option?.textRight && (
                                                        <p className="text-[11px] text-table-pagination-text">{option?.textRight}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-3 py-2 text-xs h-[50px] fcc text-center text-gray-500 truncate font-inter">No hay opciones</div>
                            )}
                        </div>
                    </div>
                ),
                    document.body
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;