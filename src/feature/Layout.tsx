import { Sidebar } from "@components/Sidebar";
import { ToastUI } from "@components/toastUI";
import { Button } from "@components/ui/Button";
import { useMutationLogin } from "@lib/services/loginService";
import { collapsedStore } from "@lib/stores/collapsedStore";
import { userStore } from "@lib/stores/userStore";
import { Outlet, useLocation, useOutlet } from "react-router-dom";

export const MainLayout = () => {
  const existOutlet = useOutlet();
  const pathname = useLocation().pathname;

  const { isSidebarCollapsed } = collapsedStore()
  const { username } = userStore()


  const isLogin =
    pathname === "/login" || pathname === "/register" || pathname === "/";

  const { logoutMutate, isLoadingLogout } = useMutationLogin();

  const handleLogout = () => {
    logoutMutate();
  };


  return (
    <div className="w-screen h-screen grid place-items-center">
      <ToastUI />

      {!isLogin && (
        <div className="w-screen h-screen">
          <div
            className="grid w-full h-full grid-rows-[64px_1fr] transition-all duration-300"
            style={{
              gridTemplateColumns: isSidebarCollapsed ? "70px 1fr" : "260px 1fr",
            }}
          >
            <Sidebar />

            {/* Navbar */}
            <header className="border-b flex justify-between bg-white  items-center px-4">
              Hola, {username}
              <Button
                variant="primary"
                loading={isLoadingLogout}
                disabled={isLoadingLogout}
                filled
                size="xs"
                className="p-2 w-full mt-2"
                onClick={handleLogout}
              >
                Salir
              </Button>
            </header>

            {/* Content */}
            <main className="p-4 h-[calc(100vh-64px)] overflow-y-auto bg-slate-100">
              {existOutlet ? <Outlet /> : <div className="flex-1"></div>}
            </main>
          </div>
        </div>
      )
      }
      {existOutlet && isLogin ? <Outlet /> : <div className="flex-1"></div>}

    </div >
  );
};

