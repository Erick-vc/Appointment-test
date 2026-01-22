import { ArrowDown } from '@assets/icons';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

export type TActionDropdown = {
    label: string | React.JSX.Element;
    icon?: React.ReactNode;
    onClick: () => void;
    itemClassName?: string;
    disabled?: boolean; // opcional, si se quiere deshabilitar la acción
    customTooltip?: React.JSX.Element;
    hasNestedDropdown?: boolean; // indica si tiene dropdown anidado
    nestedDropdownComponent?: React.ReactNode; // componente del dropdown anidado
    loading?: boolean;
};

interface DropdownProps {
    label: string | React.JSX.Element; // texto del button (“Acciones”)
    actions: TActionDropdown[]; // items del menú
    btnClassName?: string; // estilos extra para el botón
    portalClassName?: string;
    isIconArrow?: boolean;
    menuWidth?: number;
    iconClassName?: string;
    align?: 'left' | 'right'; // alineación del menú respecto al botón
}

/** Portal root (se crea 1-sola vez) */
const ensurePortalRoot = () => {
    let node = document.getElementById('dropdown-portal-root');
    if (!node) {
        node = document.createElement('div');
        node.id = 'dropdown-portal-root';
        document.body.appendChild(node);
    }
    return node;
};

export const DropdownActions = ({
    label,
    actions,
    align = 'left',
    btnClassName = 'bg-[#F9F9F9] hover:bg-[#F1F1F4]',
    isIconArrow = true,
    portalClassName,
    iconClassName,
    menuWidth = 220, // sigue siendo opcional, por si quieres forzarlo
}: DropdownProps) => {
    const [open, setOpen] = useState(false);
    const [activeNestedIndex, setActiveNestedIndex] = useState<number | null>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });


    /** Recalcula la posición cada vez que el menú se abre y después de pintarse */
    useLayoutEffect(() => {
        if (!open || !btnRef.current || !menuRef.current) return;

        const btnRect = btnRef.current.getBoundingClientRect();
        const winH = window.innerHeight;

        // Usa el ancho REAL del menú, o bien el forzado por prop
        const realWidth = menuRef.current.offsetWidth || menuWidth;
        const realHeight = menuRef.current.offsetHeight;

        let top = btnRect.bottom + 4; // por defecto, debajo del botón
        if (top + realHeight > winH) {
            // cabe en pantalla?
            top = Math.max(8, btnRect.top - realHeight - 8); // colócalo arriba
        }

        const left =
            align === 'left'
                ? btnRect.left // se expande a la derecha
                : btnRect.right - realWidth; // 🔹 se expande a la izquierda

        setCoords({
            top: Math.min(top, winH - realHeight - 8),
            left: Math.max(8, left), // evita salirse por la izq.
        });
    }, [open, align, actions.length, menuWidth]);

    /* click‑outside … igual que antes */
    useEffect(() => {
        if (!open) {
            // Resetear el dropdown anidado cuando se cierra el menú principal
            setActiveNestedIndex(null);
            return;
        }
        const handler = (e: MouseEvent) => {
            if (!btnRef.current?.contains(e.target as Node) && !menuRef.current?.contains(e.target as Node)) {
                setOpen(false);
                setActiveNestedIndex(null); // Resetear también al cerrar por click fuera
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    /* MENU ‑ usa style.width para que Tailwind no imponga w‑56 */
    const menu = open ? (
        <div ref={menuRef} data-select-dropdown="true" style={{ position: 'absolute', ...coords, width: menuWidth }} className={`bg-white border border-[#e5e7eb] shadow-lg z-9999 rounded-[12px] p-[6px]  ${portalClassName ?? ""}`}>
            {actions.map(({ label, icon, onClick, disabled, customTooltip, itemClassName, hasNestedDropdown, nestedDropdownComponent, loading }, i) => (
                <div key={i} className="relative group">
                    <Button
                        variant="light"
                        onClick={(e) => {
                            if (hasNestedDropdown) {
                                e.stopPropagation();
                                setActiveNestedIndex(activeNestedIndex === i ? null : i);
                            } else {
                                onClick();
                                setOpen(false);
                            }
                        }}
                        loading={loading}
                        disabled={disabled}
                        iconLeft={icon}
                        className={`w-full  text-[13px] leading-[13px]  flex justify-start items-center p-2 border-[6px] bg-transparent border-none hover:bg-[#F1F1F4] font-normal ${disabled ? 'cursor-not-allowed opacity-50' : 'text-[#252F4A]'
                            } ${itemClassName || ''}`}
                        sizeIcon="sm"
                    >
                        {label}
                    </Button>
                    {customTooltip}
                    {/* Renderizar dropdown anidado si está activo */}
                    {hasNestedDropdown && activeNestedIndex === i && nestedDropdownComponent}
                </div>
            ))}
        </div>
    ) : null;

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={() => setOpen((p) => !p)}
                className={`flex h-[34px] items-center gap-1 rounded-[6px] border border-[#e5e7eb]  px-[10px] py-[9px] text-[12px] font-inter transition-all  ${open ? 'text-[#252F4A]' : 'text-[#4B5675]'
                    } ${btnClassName}`}
            >
                {label}
                {isIconArrow && <ArrowDown className={`w-4 stroke-[#78829D] transition-all ${open && 'rotate-180'} ${iconClassName}`} />}
            </button>

            {menu && createPortal(menu, ensurePortalRoot())}
        </>
    );
};
