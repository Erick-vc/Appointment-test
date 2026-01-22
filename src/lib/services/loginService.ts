import { api } from "@api/index";
import { useMutation } from "@tanstack/react-query";
import { userStore } from "../stores/userStore";
import type { TUserLoing, TUserRegister } from "../types";

export const postLogin = async (user: TUserLoing) => {
  console.log("entro");
  const res = await api.post("users/login_email/", user);
  return res.data;
};

export const postRegister = async (
  user: Omit<TUserRegister, "confirmPassword">
) => {
  const res = await api.post("users/register/", user);
  return res.data;
};

export const postLogout = async () => {
  const res = await api.post("users/logout/");
  return res.data;
};

export const useMutationLogin = () => {
  const { setAuth } = userStore();
  const { mutate: loginMutate, isPending: isLoadingLogin } = useMutation({
    mutationFn: (user: TUserLoing) => postLogin(user),
  });

  const { mutate: registerMutate, isPending: isLoadingRegister } = useMutation({
    mutationFn: (user: Omit<TUserRegister, "confirmPassword">) =>
      postRegister(user),
  });

  const { mutate: logoutMutate, isPending: isLoadingLogout } = useMutation({
    mutationFn: () => postLogout(),
    onSuccess: () => {
      setAuth({
        accessToken: "",
        refreshToken: "",
        user_id: 0,
        username: "",
      });
    },
  });

  return {
    loginMutate,
    isLoadingLogin,
    registerMutate,
    isLoadingRegister,
    logoutMutate,
    isLoadingLogout,
  };
};
