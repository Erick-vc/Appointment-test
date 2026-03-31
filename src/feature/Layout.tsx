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
            className="grid w-full h-full grid-rows-[64px_1fr] bg-[linear-gradient(135deg,#f8fbff_0%,#eef3ff_42%,#f5f7ff_100%)] transition-[grid-template-columns] duration-200 ease-out"
            style={{
              gridTemplateColumns: isSidebarCollapsed ? "84px 1fr" : "290px 1fr",
            }}
          >
            <Sidebar />

            <header className="flex items-center justify-between border-b border-[#e6ebf5] bg-white/85 px-8 backdrop-blur-sm">
              <div>
                <p className="text-[28px] font-semibold text-[#172b4d]">
                  Hola, {username}
                </p>
              </div>
              <Button
                variant="primary"
                loading={isLoadingLogout}
                disabled={isLoadingLogout}
                filled
                size="xs"
                className="mt-2 w-auto rounded-xl px-5 py-2"
                onClick={handleLogout}
              >
                Salir
              </Button>
            </header>

            <main className="h-[calc(100vh-64px)] overflow-y-auto p-6 min-h-0">
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
