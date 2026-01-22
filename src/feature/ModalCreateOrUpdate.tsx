import { Button } from "@components/ui/Button"
import { ErrorMessage } from "@components/ui/ErrorMessage"
import Input from "@components/ui/Input"
import Select from "@components/ui/Select"
import { TextArea } from "@components/ui/TextArea"
import { useMutationAppointment, useRetrieveAppointment } from "@lib/services/appointmentService"
import { useModalStore } from "@lib/stores/modalStore"
import { useToastStore } from "@lib/stores/toastStore"
import { userStore } from "@lib/stores/userStore"
import type { TAppointmentRequest } from "@lib/types/appointment"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

type Props = {
    appointmentId?: number
}

export const ModalCreateOrUpdate = ({ appointmentId }: Props) => {
    const { hideModal } = useModalStore()
    const { user_id } = userStore()
    const { control, formState: { errors }, handleSubmit, reset } = useForm<TAppointmentRequest>()
    const { createAppointmentMutate, isLoadingCreateAppointment, updateAppointmentMutate, isLoadingUpdateAppointment } = useMutationAppointment()
    const { dataAppointment } = useRetrieveAppointment(appointmentId || 0)
    const { showToast } = useToastStore()

    useEffect(() => {
        if (!dataAppointment) return

        const dataForm: TAppointmentRequest = {
            name: dataAppointment?.name || "",
            description: dataAppointment?.description || "",
            status: dataAppointment?.status || "pending",
            owner: dataAppointment?.owner || user_id,
        }

        reset(dataForm)

    }, [dataAppointment, reset])


    const handleCancel = () => {
        hideModal()
    }

    const onSubmit = (data: TAppointmentRequest) => {
        if (appointmentId) {
            updateAppointmentMutate({ id: appointmentId, appointment: { ...data, owner: user_id } }, {
                onSuccess: () => {
                    showToast({
                        iconType: "success",
                        message: "Cita actualizada correctamente",
                    })
                    hideModal()
                },
                onError: (error) => {
                    showToast({
                        iconType: "error",
                        message: error.message,
                    })
                }
            })
            return
        } else {
            createAppointmentMutate({ ...data, owner: user_id }, {
                onSuccess: () => {
                    showToast({
                        iconType: "success",
                        message: "Cita creada correctamente",
                    })
                    hideModal()
                },
                onError: (error) => {
                    showToast({
                        iconType: "error",
                        message: error.message,
                    })
                }
            })
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 p-4">
                <Controller
                    control={control}
                    name="name"
                    rules={{ required: "El nombre es requerido" }}
                    render={({ field }) => {
                        return (
                            <div className="flex flex-col gap-1">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre</label>
                                <Input
                                    type="text"
                                    value={field.value ?? ""}
                                    className="w-full"
                                    onChange={field.onChange}
                                />
                                <ErrorMessage message={errors.name?.message || ""} />
                            </div>
                        )
                    }}
                />
                <Controller
                    control={control}
                    name="description"
                    rules={{ required: "La descripción es requerida" }}
                    render={({ field }) => {
                        return (
                            <div className="flex flex-col gap-1">
                                <label htmlFor="description" className="text-sm font-medium text-gray-700">Descripción</label>
                                <TextArea
                                    value={field.value ?? ""}
                                    className="w-full"
                                    onChange={field.onChange}
                                />
                                <ErrorMessage message={errors.description?.message || ""} />
                            </div>
                        )
                    }}
                />
                <Controller
                    control={control}
                    name="status"
                    rules={{ required: "El estado es requerido" }}
                    render={({ field }) => (
                        <div className="flex flex-col gap-1">
                            <label htmlFor="status" className="text-sm font-medium text-gray-700">Estado</label>
                            <Select
                                value={field.value ?? ""}
                                className="w-full"
                                onChange={field.onChange}
                                options={[
                                    { id: "pending", label: "Pendiente" },
                                    { id: "in_progress", label: "En Proceso" },
                                    { id: "done", label: "Completado" },
                                ]}
                            />
                            <ErrorMessage message={errors.status?.message || ""} />
                        </div>
                    )}
                />
            </div>

            <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
                <Button
                    variant="light"
                    filled
                    onClick={handleCancel}
                >
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    filled
                    disabled={isLoadingCreateAppointment || isLoadingUpdateAppointment}
                    loading={isLoadingCreateAppointment || isLoadingUpdateAppointment}
                    onClick={handleSubmit(onSubmit)}
                >
                    Guardar
                </Button>
            </div>

        </div>
    )
}
