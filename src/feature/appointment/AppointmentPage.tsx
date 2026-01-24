import { DeleteIcon, EditIcon, Plus } from "@assets/icons";
import TableComponent from "@components/TableComponent";
import { TableSkeleton } from "@components/TableSkeleton";
import { Button } from "@components/ui/Button";
import { DropdownActions } from "@components/ui/DropdownActions";
import { ModalActions } from "@components/ui/modal/ModalActions";
import { useGetAppointment, useMutationAppointment } from "@lib/services/appointmentService";
import { useModalStore } from "@lib/stores/modalStore";
import { useToastStore } from "@lib/stores/toastStore";
import type { TColumnsTable } from "@lib/types";
import type { TAppointment } from "@lib/types/appointment";
import { useState } from "react";
import { ModalCreateOrUpdate } from "./ModalCreateOrUpdate";
import { TitleHeader } from "@components/TitleHeader";


export const AppointmentPage = () => {

  const columns: TColumnsTable<TAppointment>[] = [
    { name: 'ID', key: 'id', type: 'number', initialWidth: 80 },
    { name: 'Nombre', key: 'name', type: 'string', initialWidth: 200 },
    { name: 'Descripcion', key: 'description', type: 'string' },
    { name: 'Fecha de creacion', key: 'created_at', type: 'date' },
    { name: 'Fecha de actualizacion', key: 'updated_at', type: 'date' },
    { name: 'Estado', key: 'status', type: 'string' },
  ];

  const { dataAppointments, isLoadingAppointments } = useGetAppointment();
  const { deleteAppointmentMutate, bulkDeleteAppointmentMutate } = useMutationAppointment()
  const { showModal, hideModal } = useModalStore();
  const [selectedRows, setSelectedRows] = useState<TAppointment[]>([])
  const { showToast } = useToastStore()

  const handleAddAppointment = () => {
    showModal({
      title: 'Agregar Cita',
      content: <ModalCreateOrUpdate />,
    });
  };

  const getSelectedRows = (rows: TAppointment[]) => {
    setSelectedRows(rows)
  }

  const buttonsHeaders = (selectedRows: TAppointment[]) => {

    const ids = selectedRows.map((row) => row.id)

    const actions = [
      {
        label: "Eliminar",
        icon: <DeleteIcon />,
        itemClassName: '!text-[#F8285A]',
        onClick: () => {
          bulkDeleteAppointmentMutate(ids)
        }
      }
    ]


    return (
      <div className="flex items-center gap-2">
        {selectedRows?.length > 0 && (
          <DropdownActions
            label="Acciones" actions={actions} menuWidth={160} align="right" />
        )}
        <Button
          variant="primary"
          filled
          sizeIcon="xs"
          onClick={handleAddAppointment}
          iconLeft={<Plus color="white" fill="white" width={12} height={12} />}
        >
          Agregar Cita
        </Button>
      </div>
    )
  }

  const handleEdit = (row: TAppointment) => {
    const appointmentId = row.id
    showModal({
      title: 'Editar cita',
      content: <ModalCreateOrUpdate appointmentId={appointmentId} />,
    });
  }

  const handleDelete = (row: TAppointment) => {
    const appointmentId = row.id

    const handleSubmit = () => {
      deleteAppointmentMutate(appointmentId, {
        onSuccess: () => {
          showToast({
            iconType: 'success',
            message: 'Cita eliminada exitosamente',
          })
          hideModal()
        },
        onError: (error) => {
          showToast({
            iconType: 'error',
            message: error.message,
          })
        }
      })
    }

    showModal({
      title: 'Eliminar cita',
      content: <ModalActions onSubmit={handleSubmit} textSubmit="Eliminar" children={
        <p className="text-xs font-normal text-[#252F4A]">¿Estás seguro de que deseas eliminar esta cita?</p>
      } />,
    });
  }

  // if (isLoadingAppointments) {
  //   return <TableSkeleton rows={5} columns={5} />
  // }

  return (
    <div className="flex flex-col gap-4  justify-center ">

      <TitleHeader title="Citas" subTitle="Accede a la información de los citas, revisa su estado y realiza acciones sobre ellos." />

      <TableComponent<TAppointment>
        columns={columns}
        data={dataAppointments || []}
        fromName="citas"
        // Checkboxes
        withCheck={true}
        buttonsHeaders={buttonsHeaders(selectedRows)}

        singleRowSelection={false} // true para single, false para multiple
        getSelectedRows={(rows) => getSelectedRows(rows)}

        // Actions
        menuActions={(row) => [
          {
            label: 'Editar',
            icon: <EditIcon />,
            action: () => handleEdit(row)
          },
          {
            label: 'Eliminar',
            icon: <DeleteIcon />,
            action: () => handleDelete(row)
          }
        ]}

        // Layout (opcional)
        // height="h-[600px]" // Sobrescribe el h-full por defecto
        widthInitial={150}
      // className="my-custom-class"
      />
    </div>
  );
};
