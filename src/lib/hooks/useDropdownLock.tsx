import { useCallback, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';

export type TUseDropdownLockProps = {
    open: boolean;
    onClose?: () => void; // opcional: callback extra al cerrar
    overlayClassName?: string; // personalizar overlay (ej: 'bg-black/30')
    zIndexOverlay?: number;   // default 9998
    zIndexDropdown?: number;  // default 9999
}

export const useDropdownLock = ({
    open,
    onClose,
    overlayClassName = '',
    zIndexOverlay = 9998,
    zIndexDropdown = 9999,
}: TUseDropdownLockProps) => {
    const previousOverflow = useRef<string>('');
    const previousPaddingRight = useRef<string>('');

    // === BLOQUEO DE SCROLL ===
    const lockScroll = useCallback(() => {
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        previousOverflow.current = document.body.style.overflow;
        previousPaddingRight.current = document.body.style.paddingRight;

        document.body.style.overflow = 'hidden';
        if (scrollBarWidth > 0) {
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        }
    }, []);

    const unlockScroll = useCallback(() => {
        document.body.style.overflow = previousOverflow.current;
        document.body.style.paddingRight = previousPaddingRight.current;
    }, []);

    // === CIERRE GENERAL ===
    const close = useCallback(() => {
        onClose?.();
    }, [onClose]);

    // Aplicar bloqueo
    useEffect(() => {
        if (open) {
            lockScroll();
        } else {
            unlockScroll();
        }
        return () => unlockScroll();
    }, [open, lockScroll, unlockScroll]);

    // === ESCAPE ===
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                close();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open, close]);

    // === RESIZE ===
    useEffect(() => {
        const handleResize = () => {
            if (open) close();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [open, close]);

    // === BLOQUEO DE DRAG AND DROP ===
    // Cierra el dropdown si se intenta iniciar un drag fuera del dropdown
    useEffect(() => {
        if (!open) return;

        const handleMouseDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Si el click es dentro del dropdown, no hacer nada
            if (target.closest('[data-select-dropdown="true"]')) return;
            // Si el click es en el trigger del select, no hacer nada (el select lo maneja)
            if (target.closest('[data-radix-select-trigger]')) return;
            // Cerrar el dropdown
            close();
        };

        // Capturar en la fase de captura para interceptar antes que otros handlers
        document.addEventListener('mousedown', handleMouseDown, true);
        return () => document.removeEventListener('mousedown', handleMouseDown, true);
    }, [open, close]);

    // === BLOQUEO DE SCROLL EN CONTENEDORES ===
    // Cierra el dropdown si se hace scroll fuera del dropdown
    useEffect(() => {
        if (!open) return;

        const handleScroll = (e: Event) => {
            const target = e.target as HTMLElement;
            // Si el scroll es dentro del dropdown, permitirlo
            if (target.closest('[data-select-dropdown="true"]')) return;
            // Si el scroll es en el body (ya bloqueado), ignorar
            if (target === document.body || target === document.documentElement) return;
            // Cerrar el dropdown si se hace scroll en otro contenedor
            close();
        };

        // Capturar scroll en fase de captura para detectar scroll en cualquier contenedor
        document.addEventListener('scroll', handleScroll, true);
        return () => document.removeEventListener('scroll', handleScroll, true);
    }, [open, close]);

    // === OVERLAY PARA PORTAL ===
    const overlay = open
        ? ReactDOM.createPortal(
            <div
                className={`fixed inset-0 ${overlayClassName} z-[${zIndexOverlay}]`}
                onClick={close}
                style={{ zIndex: zIndexOverlay }}
            />,
            document.body
        )
        : null;

    // === ENVOLTORIO PARA DROPDOWN (para aplicar z-index alto) ===
    const wrapDropdown = (dropdown: React.ReactNode) => {
        if (!open) return null;
        return (
            <>
                {overlay}
                <div data-select-dropdown="true" style={{ zIndex: zIndexDropdown }}>{dropdown}</div>
            </>
        );
    };

    return {
        overlay,          // usa directamente en portal si quieres control manual
        wrapDropdown,     // recomendado: envuelve tu dropdown → automático
        close,            // para cerrar manualmente
    };
};