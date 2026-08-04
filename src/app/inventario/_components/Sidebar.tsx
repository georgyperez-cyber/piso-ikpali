"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "../_lib/store";

type Item = { href: string; label: string; route: string };

const ALL: Item[] = [
  { href: "/inventario", label: "Dashboard", route: "" },
  { href: "/inventario/venta", label: "Venta", route: "venta" },
  { href: "/inventario/ventas", label: "Ventas del día", route: "ventas" },
  { href: "/inventario/piezas", label: "Piezas", route: "piezas" },
  { href: "/inventario/marcas", label: "Marcas", route: "marcas" },
  { href: "/inventario/entradas", label: "Entradas", route: "entradas" },
  { href: "/inventario/salidas", label: "Salidas", route: "salidas" },
  { href: "/inventario/reservas", label: "Reservas", route: "reservas" },
  { href: "/inventario/caja", label: "Caja", route: "caja" },
  { href: "/inventario/liquidaciones", label: "Liquidaciones", route: "liquidaciones" },
  { href: "/inventario/reportes", label: "Reportes", route: "reportes" },
  { href: "/inventario/usuarios", label: "Usuarios", route: "usuarios" },
];

const FOR_ROLE = {
  admin: ALL.map((i) => i.route),
  manager: ALL.filter((i) => !["usuarios"].includes(i.route)).map((i) => i.route),
  empleado: ["", "venta", "ventas", "piezas", "reservas", "caja"],
} as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useStore();
  const visible = FOR_ROLE[currentUser.role];
  const items = ALL.filter((i) => visible.includes(i.route as never));

  const isActive = (href: string) => {
    if (href === "/inventario") return pathname === "/inventario";
    return pathname?.startsWith(href);
  };

  return (
    <aside className="w-[220px] shrink-0 border-r border-rojo/15 bg-blanco flex flex-col">
      <Link href="/inventario" className="block px-5 pt-6 pb-5 border-b border-rojo/15">
        <div className="text-rojo font-medium leading-tight text-[16px]" style={{ letterSpacing: "-0.01em" }}>
          piso · ikpali
        </div>
        <div className="text-[9px] tracking-[0.22em] uppercase text-rojo/60 mt-1">
          inventario · caja · liquidación
        </div>
      </Link>

      <nav className="flex-1 py-3">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={`flex items-center gap-2 px-5 py-2 text-[12px] tracking-[0.06em] transition-colors ${
              isActive(it.href)
                ? "bg-rojo text-blanco"
                : "text-rojo/80 hover:bg-rojo/5"
            }`}
          >
            <span
              className={`inline-block w-[5px] h-[5px] rounded-full ${
                isActive(it.href) ? "bg-blanco" : "bg-rojo/40"
              }`}
            />
            <span className="font-medium">{it.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-rojo/15 text-[9px] tracking-[0.2em] uppercase text-rojo/45">
        v0.1 · interno
      </div>
    </aside>
  );
}
