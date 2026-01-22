import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./feature/Home";
import { MainLayout } from "./feature/Layout";
import { Login } from "./feature/Login";
import { NewAccount } from "./feature/NewAccount";
import { queryClient } from "./lib/queryClient";
import { UserInitializer } from "./lib/utils/userInitializer";
import { ModalRenderer } from "@components/ui/modal/ModalRenderer";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserInitializer>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route path="/register" element={<NewAccount />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<HomePage />} />
            </Route>
          </Routes>
          <ModalRenderer />
        </UserInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
