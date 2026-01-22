import { useModalStore } from "@lib/stores/modalStore";
import { Button } from "../Button";

type Props = {
    onCancel?: () => void;
    onSubmit: () => void;
    textCancel?: string;
    textSubmit?: string;
    className?: string;
    children?: React.ReactNode;
}

export const ModalActions = ({ onCancel, onSubmit, textCancel = 'Cancelar', textSubmit = 'Guardar', className = '', children }: Props) => {
    const { hideModal } = useModalStore()

    const handleCancel = () => {
        hideModal()
        onCancel?.()
    }

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="flex justify-center items-center px-4 py-6 ">
                {children}
            </div>
            <div className="flex gap-2 justify-end p-4 border-t border-[#E5E7EB]">
                <Button
                    onClick={handleCancel}
                    variant="light"
                    filled
                >
                    {textCancel}
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="danger"
                    filled
                >
                    {textSubmit}
                </Button>
            </div>

        </div>
    )
}
