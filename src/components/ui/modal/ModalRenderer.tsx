import { useModalStore } from '@lib/stores/modalStore';
import React, { useEffect } from 'react';
import { ModalPortal } from './ModalPortal';

export const ModalRenderer: React.FC = () => {
    const { modals, isCloseBackground, hideModal } = useModalStore();

    // Efecto para manejar el scroll del body cuando hay modales abiertos
    useEffect(() => {
        if (modals.length > 0) {
            // Bloquear scroll cuando hay modales
            document.body.style.overflow = 'hidden';
            // Opcional: guardar el padding actual para evitar saltos
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            // Restaurar scroll cuando no hay modales
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        // Cleanup al desmontar
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [modals.length]);

    const handleClose = () => {
        if (isCloseBackground) {
            hideModal();
        }
    };

    return (
        <>
            {modals.map((modal, index) => {
                return <ModalPortal key={index} modal={modal} handleClose={handleClose} isCloseBackground={isCloseBackground} />;
            })}
        </>
    );
};
