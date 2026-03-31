import { api } from "@api/index";
import type {
  TAccountSettingsRequest,
  TAccountSettingsResponse,
  TChangePasswordRequest,
  TAccountProfileRequest,
  TAccountProfileResponse,
} from "@lib/types/account";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getAccountProfile = async () => {
  try {
    const response = await api.get("users/profile/");
    return response.data as TAccountProfileResponse;
  } catch {
    return null;
  }
};

const updateAccountProfile = async (payload: TAccountProfileRequest) => {
  const response = await api.put("users/profile/", payload);
  return response.data as TAccountProfileResponse;
};

const getAccountSettings = async () => {
  try {
    const response = await api.get("users/settings/");
    return response.data as TAccountSettingsResponse;
  } catch {
    return null;
  }
};

const updateAccountSettings = async (payload: TAccountSettingsRequest) => {
  const response = await api.put("users/settings/", payload);
  return response.data as TAccountSettingsResponse;
};

const changeAccountPassword = async (payload: TChangePasswordRequest) => {
  const response = await api.post("users/change-password/", payload);
  return response.data;
};

const closeOtherSessions = async () => {
  const response = await api.post("users/sessions/close-others/");
  return response.data;
};

const exportAccountData = async () => {
  const response = await api.post("users/export-data/");
  return response.data;
};

const deactivateAccount = async () => {
  const response = await api.post("users/deactivate/");
  return response.data;
};

const deleteAccount = async () => {
  const response = await api.delete("users/delete/");
  return response.data;
};

export const useGetAccountProfile = () => {
  const { data: dataAccountProfile, isLoading: isLoadingAccountProfile } =
    useQuery<TAccountProfileResponse | null>({
      queryKey: ["account-profile"],
      queryFn: getAccountProfile,
      retry: false,
    });

  return {
    dataAccountProfile,
    isLoadingAccountProfile,
  };
};

export const useMutationAccountProfile = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateAccountProfileMutate,
    isPending: isLoadingUpdateAccountProfile,
  } = useMutation({
    mutationFn: updateAccountProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-profile"] });
    },
  });

  return {
    updateAccountProfileMutate,
    isLoadingUpdateAccountProfile,
  };
};

export const useGetAccountSettings = () => {
  const { data: dataAccountSettings, isLoading: isLoadingAccountSettings } =
    useQuery<TAccountSettingsResponse | null>({
      queryKey: ["account-settings"],
      queryFn: getAccountSettings,
      retry: false,
    });

  return {
    dataAccountSettings,
    isLoadingAccountSettings,
  };
};

export const useMutationAccountSettings = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateAccountSettingsMutate,
    isPending: isLoadingUpdateAccountSettings,
  } = useMutation({
    mutationFn: updateAccountSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-settings"] });
    },
  });

  const {
    mutate: changeAccountPasswordMutate,
    isPending: isLoadingChangeAccountPassword,
  } = useMutation({
    mutationFn: changeAccountPassword,
  });

  const {
    mutate: closeOtherSessionsMutate,
    isPending: isLoadingCloseOtherSessions,
  } = useMutation({
    mutationFn: closeOtherSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-settings"] });
    },
  });

  const {
    mutate: exportAccountDataMutate,
    isPending: isLoadingExportAccountData,
  } = useMutation({
    mutationFn: exportAccountData,
  });

  const {
    mutate: deactivateAccountMutate,
    isPending: isLoadingDeactivateAccount,
  } = useMutation({
    mutationFn: deactivateAccount,
  });

  const {
    mutate: deleteAccountMutate,
    isPending: isLoadingDeleteAccount,
  } = useMutation({
    mutationFn: deleteAccount,
  });

  return {
    updateAccountSettingsMutate,
    isLoadingUpdateAccountSettings,
    changeAccountPasswordMutate,
    isLoadingChangeAccountPassword,
    closeOtherSessionsMutate,
    isLoadingCloseOtherSessions,
    exportAccountDataMutate,
    isLoadingExportAccountData,
    deactivateAccountMutate,
    isLoadingDeactivateAccount,
    deleteAccountMutate,
    isLoadingDeleteAccount,
  };
};
