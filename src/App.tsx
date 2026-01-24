import { ModalRenderer } from "@components/ui/modal/ModalRenderer";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AppointmentPage } from "./feature/appointment/AppointmentPage";
import { MainLayout } from "./feature/Layout";
import { Login } from "./feature/Login";
import { NewAccount } from "./feature/NewAccount";
import { queryClient } from "./lib/queryClient";
import { UserInitializer } from "./lib/utils/userInitializer";
import { DashboardPage } from "./feature/dashboard/DashboardPage";
import { AccountPage } from "./feature/account/AccountPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserInitializer>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route path="/register" element={<NewAccount />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<AppointmentPage />} />
              <Route path="/estadisticas" element={<DashboardPage />} />
              <Route path="/citas" element={<AppointmentPage />} />
              <Route path="/perfil" element={<AccountPage />} />
            </Route>
          </Routes>
          <ModalRenderer />
        </UserInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
