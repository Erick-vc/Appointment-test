import { Button } from "@components/ui/Button";
import { useToastStore } from "@lib/stores/toastStore";
import { userStore } from "@lib/stores/userStore";
import type { TUserLoing } from "@lib/types";
import { isAxiosError } from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutationLogin } from "../lib/services/loginService";

export const Login = () => {
  const methods = useForm<TUserLoing>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { loginMutate, isLoadingLogin } = useMutationLogin();
  const { showToast } = useToastStore();
  const navigate = useNavigate();
  const { setAuth } = userStore();

  const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);

  const handleLogin = (user: TUserLoing) => {
    loginMutate(user, {
      onSuccess: (data) => {
        setAuth({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user_id: data.user_id,
          username: data.username,
        });
        navigate("/home");
      },
      onError: (error) => {
        console.log("error", error);
        if (isAxiosError(error)) {
          showToast({
            message: "Error",
            subMessage: error.response?.data.message,
            iconType: "error",
          });
        }
        showToast({
          message: "Error",
          subMessage: "Ocurrio un error inesperado",
          iconType: "error",
        });
      },
    });
  };

  return (
    <div className="flex flex-col gap-1 max-w-md bg-white pt-4 pb-12 px-8 rounded-xl shadow-md">
      <div className="flex flex-col gap-1 text-center mt-6 mb-10">
        <p className="text-xl font-bold">Inice sesión</p>
        <span className="text-[#4B5675] text-md leading-[16px]">
          Ingrese para gestionar sus citas en el sistema.
        </span>
      </div>

      <div className="flex flex-col">
        <label className="text-md text-black mb-1">*Usuario</label>
        <Controller
          name="username"
          rules={{ required: "El campo es requerido" }}
          control={control}
          render={({ field }) => {
            return (
              <input
                {...field}
                type="text"
                placeholder="Usuario"
                className="outline-none border border-gray-300 py-2 px-3 rounded-md text-sm"
              />
            );
          }}
        />
        <p className="h-4 text-xs italic text-red-500 ">
          {errors.username?.message}
        </p>
      </div>

      <div className="flex flex-col">
        <label className="text-md text-black mb-1">*Contraseña</label>
        <div className="flex items-center justify-between gap-2 border border-gray-300 py-2 px-3 rounded-md">
          <Controller
            name="password"
            rules={{ required: "El campo es requerido" }}
            control={control}
            render={({ field }) => {
              return (
                <input
                  {...field}
                  type={isVisiblePassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="outline-none border-none text-sm"
                />
              );
            }}
          />

          <div
            className="cursor-pointer"
            onClick={() => setIsVisiblePassword(!isVisiblePassword)}
          >
            {!isVisiblePassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            )}
          </div>
        </div>
        <p className="h-4 text-xs italic text-red-500 ">
          {errors.password?.message}
        </p>
      </div>

      <Button
        variant="primary"
        loading={isLoadingLogin}
        disabled={isLoadingLogin}
        filled
        size="xs"
        className="p-2 w-full mt-2"
        onClick={handleSubmit(handleLogin)}
      >
        INGRESAR
      </Button>

      <div className="flex flex-col items-center gap-2 p-4 mt-4 bg-slate-100 rounded-md">
        <p className="text-xs text-[#4B5675]">
          ¿Aún no te has registrado?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[#4B5675] underline cursor-pointer"
          >
            Crear cuenta
          </span>
        </p>
        <p className="text-[10px] text-[#4B5675]">
          ¿Olvidaste tu contraseña?{" "}
          <span className="text-[#4B5675] underline cursor-pointer">
            Recuperar contraseña
          </span>
        </p>
      </div>
    </div>
  );
};
