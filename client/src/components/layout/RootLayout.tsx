import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.js";
import { Header } from "./Header.js";

export function RootLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-slate-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
