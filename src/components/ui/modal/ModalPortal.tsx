import { Plus } from '@assets/icons';
import type { TModal } from '@lib/types';
import React from 'react';
import ReactDOM from 'react-dom';

type Props = {
    modal: TModal;
    handleClose: () => void;
    isCloseBackground: boolean;
};

export const ModalPortal: React.FC<Props> = ({ modal, handleClose, isCloseBackground }) => {
    const {
        nonBlocking = false,
        position,
        content,
        showCloseButton = true,
        height = 'auto',
        width = '500px',
        title,
        showHeader = true,
        modalClassName,
        contentClassName,
        contentTitleClassName,
        slideFrom,
        closeOnOutsideClick = false,
    } = modal;

    // Cerrar si clickea afuera (solo si está habilitado)
    const handleOutsideClick = (e: React.MouseEvent) => {
        if (!nonBlocking && isCloseBackground && closeOnOutsideClick && e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Contenedor principal
    const containerClassName = nonBlocking
        ? // Modal flotante
        `font-inter fixed z-[9999] pointer-events-none`
        : slideFrom
            ? // Panel lateral
            `font-inter fixed inset-0 bg-black/50 z-[102] transition-all duration-300 opacity-100`
            : // Modal bloqueante (tradicional)
            `font-inter fixed inset-0 bg-black/50 flex justify-center items-center z-[102] transition-all duration-300 opacity-100`;

    // Estilo del contenedor del modal en sí
    const modalStyle: React.CSSProperties = nonBlocking
        ? {
            position: 'fixed',
            width,
            height,
            // Aplica las coordenadas que vengan en "position"
            top: position?.top,
            right: position?.right,
            bottom: position?.bottom,
            left: position?.left,
            // Permite clicks dentro del modal
            pointerEvents: 'auto',
            // Animación simple
            transform: 'scale(1)',
            transition: 'transform 0.3s',
        }
        : slideFrom
            ? {
                position: 'fixed',
                top: '20px',
                bottom: '20px',
                width: width || '400px',
                height: 'calc(100vh - 40px)',
                right: slideFrom === 'right' ? '20px' : undefined,
                left: slideFrom === 'left' ? '20px' : undefined,
            }
            : {
                width,
                height,
                maxHeight: '90vh',
            };

    const modalContentClassName = nonBlocking
        ? // No bloqueante: no aplicamos la animación centrada
        `bg-white rounded-xl shadow-lg relative flex flex-col border border-[#F1F1F4] ${contentClassName || ''}`
        : slideFrom
            ? // Panel lateral: con border radius completo
            `bg-white rounded-xl shadow-lg relative flex flex-col h-full ${contentClassName || ''}`
            : // Bloqueante: con la animación normal
            `bg-white rounded-xl shadow-lg relative transition-transform transform duration-300 flex flex-col scale-100 ${contentClassName || ''}`;

    return ReactDOM.createPortal(
        <div
            onClick={handleOutsideClick}
            className={`${containerClassName} ${modalClassName || ''}`}
            role="dialog"
            aria-modal="true"
        >
            <div style={modalStyle} className={modalContentClassName} >
                {showHeader && (
                    <div className={`${title ? 'border-b border-[#F1F1F4] ' : ''} p-3 flex justify-between w-full items-center ${contentTitleClassName || ''}`}>
                        <div className="text-[16px] font-semibold text-[#071437] w-full truncate">{title}</div>
                        {showCloseButton && (
                            <div className="p-[7px]">
                                <Plus className="rotate-45 cursor-pointer" width={13} height={13} fill="#78829D" onClick={handleClose} />
                            </div>
                        )}
                    </div>
                )}
                <div className="flex-1 overflow-auto scroll-container">
                    {modal.content}
                </div>
            </div>
        </div>,
        document.body
    );
};
