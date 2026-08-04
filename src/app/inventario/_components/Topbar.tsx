"use client";

import { useStore, roleLabel, fmtDate } from "../_lib/store";

export default function Topbar() {
  const { state, currentUser, setRoleAs, resetAll } = useStore();
  const openShift = state.shifts.find((s) => s.status === "abierta");

  return (
    <header className="h-14 border-b border-rojo/15 bg-blanco flex items-center px-6 gap-6">
      <div className="flex items-center gap-3">
        <div className="text-[10px] tracking-[0.22em] uppercase text-rojo/60">
          {fmtDate(new Date().toISOString())}
        </div>
        <div className="h-3 w-px bg-rojo/20" />
        <div className="text-[10px] tracking-[0.22em] uppercase text-rojo/60">
          {openShift ? `caja abierta · fondo ${openShift.openingCash}` : "caja cerrada"}
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <span className="text-[10px] tracking-[0.2em] uppercase text-rojo/50">vista como</span>
        <select
          value={currentUser.id}
          onChange={(e) => setRoleAs(e.target.value)}
          className="h-8 border border-rojo/30 bg-blanco px-2 text-[12px] text-rojo focus:outline-none focus:border-rojo"
        >
          {state.users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} — {roleLabel(u.role)}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            if (confirm("¿Reiniciar todos los datos de demo?")) resetAll();
          }}
          className="h-8 px-3 text-[10px] tracking-[0.2em] uppercase border border-rojo/30 text-rojo/70 hover:bg-rojo/5"
          title="Reiniciar datos demo"
        >
          reset
        </button>
      </div>
    </header>
  );
}
