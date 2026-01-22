import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userStore } from "../stores/userStore";

const nonProtectedRoutes = ["/", "/login", "/register"];

export const UserInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  const { accessToken } = userStore();
  const { pathname } = useLocation();

  useEffect(() => {
    if (nonProtectedRoutes.includes(pathname)) {
      return;
    }

    if (!accessToken) {
      navigate("/login");
      return;
    }
  }, [accessToken, pathname]);

  return children;
};
