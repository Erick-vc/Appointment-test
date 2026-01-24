import { api } from "@api/index";
import type {
  TAppointmentRequest,
  TAppointmentResponse,
  TStatsAppointment,
  TStatsAppointmentCount,
} from "@lib/types/appointment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getAppointment = async () => {
  const response = await api.get("appointments/");
  return response.data;
};

export const useGetAppointment = () => {
  const {
    data: dataAppointments,
    isLoading: isLoadingAppointments,
    error,
  } = useQuery<TAppointmentResponse[]>({
    queryKey: ["appointments"],
    queryFn: getAppointment,
  });
  return { dataAppointments, isLoadingAppointments, error };
};

const retrieveAppointment = async (id: number) => {
  const response = await api.get(`appointments/${id}/`);
  return response.data;
};

export const useRetrieveAppointment = (id: number) => {
  const {
    data: dataAppointment,
    isLoading: isLoadingAppointment,
    error,
  } = useQuery<TAppointmentResponse>({
    queryKey: ["appointment", id],
    queryFn: () => retrieveAppointment(id),
    enabled: !!id,
  });

  return {
    dataAppointment,
    isLoadingAppointment,
    error: error,
  };
};

const createAppointment = async (appointment: TAppointmentRequest) => {
  const response = await api.post("appointments/", appointment);
  return response.data;
};

const updateAppointment = async (
  id: number,
  appointment: TAppointmentRequest,
) => {
  const response = await api.put(`appointments/${id}/`, appointment);
  return response.data;
};

const deleteAppointment = async (id: number) => {
  const response = await api.delete(`appointments/${id}/`);
  return response.data;
};

const bulkDeleteAppointment = async (ids: number[]) => {
  const response = await api.post(`appointments/bulk-delete/`, {
    ids,
  });
  return response.data;
};

export const useMutationAppointment = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createAppointmentMutate,
    isPending: isLoadingCreateAppointment,
  } = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const {
    mutate: updateAppointmentMutate,
    isPending: isLoadingUpdateAppointment,
  } = useMutation({
    mutationFn: (data: { id: number; appointment: TAppointmentRequest }) =>
      updateAppointment(data.id, data.appointment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const {
    mutate: deleteAppointmentMutate,
    isPending: isLoadingDeleteAppointment,
  } = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const {
    mutate: bulkDeleteAppointmentMutate,
    isPending: isLoadingBulkDeleteAppointment,
  } = useMutation({
    mutationFn: bulkDeleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    createAppointmentMutate,
    isLoadingCreateAppointment,
    updateAppointmentMutate,
    isLoadingUpdateAppointment,
    deleteAppointmentMutate,
    isLoadingDeleteAppointment,
    bulkDeleteAppointmentMutate,
    isLoadingBulkDeleteAppointment,
  };
};

const getStatsByUserAppointment = async () => {
  const response = await api.get("appointments/stats-by-user/");
  return response.data;
};

export const useGetStatsByUserAppointment = () => {
  const { data: dataStatsAppointment, isLoading: isLoadingStatsAppointment } =
    useQuery<TStatsAppointment[]>({
      queryKey: ["stats-appointment"],
      queryFn: getStatsByUserAppointment,
    });

  return {
    dataStatsAppointment,
    isLoadingStatsAppointment,
  };
};

const getStatsAppointmentCount = async () => {
  const response = await api.get("appointments/count-by-user/");
  return response.data;
};

export const useGetStatsAppointmentCount = () => {
  const {
    data: dataStatsAppointmentCount,
    isLoading: isLoadingStatsAppointmentCount,
  } = useQuery<TStatsAppointmentCount>({
    queryKey: ["stats-appointment-count"],
    queryFn: getStatsAppointmentCount,
  });

  return {
    dataStatsAppointmentCount,
    isLoadingStatsAppointmentCount,
  };
};
