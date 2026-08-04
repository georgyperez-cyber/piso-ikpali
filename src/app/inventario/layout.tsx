import type { Metadata } from "next";
import { StoreProvider } from "./_lib/store";
import Sidebar from "./_components/Sidebar";
import Topbar from "./_components/Topbar";

export const metadata: Metadata = {
  title: "Piso ikpali — Inventario",
  description: "Aplicación interna de inventario, venta, caja y consignación.",
};

export default function InventarioLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="min-h-screen w-full bg-blanco text-rojo flex">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto px-8 py-8 bg-blanco">
            {children}
          </main>
        </div>
      </div>
    </StoreProvider>
  );
}
