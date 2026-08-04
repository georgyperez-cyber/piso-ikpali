"use client";

import Link from "next/link";
import { useMemo } from "react";
import { fmtDate, fmtMXN, fmtTime, isToday, useStore } from "./_lib/store";
import { Card, Empty, Eyebrow, PageHeader, Pill, Stat, TD, TH } from "./_components/UI";

export default function DashboardPage() {
  const { state, currentUser } = useStore();

  const todaySales = useMemo(
    () => state.sales.filter((s) => s.status === "completada" && isToday(s.createdAt)),
    [state.sales]
  );

  const todayTotal = todaySales.reduce((t, s) => t + s.total, 0);
  const todayCash = todaySales
    .filter((s) => s.paymentMethod === "efectivo")
    .reduce((t, s) => t + s.total, 0);
  const todayCard = todaySales
    .filter((s) => s.paymentMethod === "tarjeta")
    .reduce((t, s) => t + s.total, 0);
  const pieceCount = todaySales.reduce((t, s) => t + s.items.reduce((q, i) => q + i.qty, 0), 0);
  const ticketAvg = todaySales.length ? todayTotal / todaySales.length : 0;

  const activePieces = state.pieces.filter((p) => p.status === "en_piso" && p.currentStock > 0);
  const reserved = state.reservations.filter((r) => r.status === "activa");
  const reservedExpiring = reserved.filter(
    (r) => new Date(r.expiresAt).getTime() - Date.now() < 1000 * 60 * 60 * 48
  );
  const damaged = state.pieces.filter((p) => p.status === "danada");
  const stale = state.pieces.filter((p) => {
    if (p.status !== "en_piso") return false;
    const days = (Date.now() - new Date(p.entryDate).getTime()) / 86400000;
    return days > 90;
  });

  const pendingLiq = state.liquidations.filter((l) => l.status === "pendiente");
  const pendingLiqTotal = pendingLiq.reduce((t, l) => t + l.brandTotal, 0);

  const openShift = state.shifts.find((s) => s.status === "abierta");
  const lastClosed = state.shifts.find((s) => s.status === "cerrada");

  const recentMoves = state.movements.slice(0, 6);

  return (
    <div>
      <PageHeader
        eyebrow={`bienvenido · ${currentUser.name.split(" ")[0].toLowerCase()}`}
        title="Estado de Piso Ikpali"
        subtitle="Operación de hoy, alertas y movimientos recientes. Toda venta deja rastro: usuario, hora y motivo."
        right={
          <Link
            href="/inventario/venta"
            className="h-11 px-5 inline-flex items-center text-[11px] tracking-[0.22em] uppercase bg-rojo text-blanco hover:bg-rojo/90"
          >
            registrar venta
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat label="venta hoy" value={fmtMXN(todayTotal)} sub={`${todaySales.length} tickets`} />
        <Stat label="efectivo" value={fmtMXN(todayCash)} />
        <Stat label="tarjeta" value={fmtMXN(todayCard)} />
        <Stat label="ticket promedio" value={fmtMXN(Math.round(ticketAvg))} sub={`${pieceCount} piezas`} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat label="piezas en piso" value={activePieces.length} sub={`${state.pieces.length} total`} />
        <Stat label="reservas activas" value={reserved.length} sub={reservedExpiring.length ? `${reservedExpiring.length} por vencer` : "—"} />
        <Stat
          label="pendiente por liquidar"
          value={fmtMXN(pendingLiqTotal)}
          sub={pendingLiq.length ? `${pendingLiq.length} marcas` : "sin pendientes"}
        />
        <Stat
          label="caja"
          value={openShift ? "abierta" : "cerrada"}
          sub={
            openShift
              ? `fondo ${fmtMXN(openShift.openingCash)} · ${fmtTime(openShift.openedAt)}`
              : lastClosed
              ? `último cierre ${fmtDate(lastClosed.closedAt!)}`
              : "—"
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <Eyebrow>ventas de hoy</Eyebrow>
            <Link href="/inventario/ventas" className="text-[10px] tracking-[0.2em] uppercase text-rojo/60 hover:text-rojo">
              ver todas →
            </Link>
          </div>
          {todaySales.length === 0 ? (
            <Empty>Sin ventas hoy. La primera deja huella.</Empty>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <TH>Folio</TH>
                  <TH>Hora</TH>
                  <TH>Usuario</TH>
                  <TH>Método</TH>
                  <TH className="text-right">Total</TH>
                </tr>
              </thead>
              <tbody>
                {todaySales.map((s) => (
                  <tr key={s.id}>
                    <TD className="font-medium">{s.folio}</TD>
                    <TD>{fmtTime(s.createdAt)}</TD>
                    <TD>{s.userName}</TD>
                    <TD>
                      <Pill tone={s.paymentMethod === "efectivo" ? "ok" : "neutral"}>
                        {s.paymentMethod}
                      </Pill>
                    </TD>
                    <TD className="text-right tabular-nums font-medium">{fmtMXN(s.total)}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card className="p-5">
          <Eyebrow>alertas</Eyebrow>
          <ul className="mt-4 space-y-3 text-[13px] font-light">
            {reservedExpiring.length > 0 && (
              <li className="flex items-start gap-2">
                <span className="mt-[6px] block w-[6px] h-[6px] rounded-full bg-rojo" />
                <span>
                  <span className="font-medium">{reservedExpiring.length} reserva(s)</span> por vencer en 48 h.
                </span>
              </li>
            )}
            {pendingLiq.length > 0 && (
              <li className="flex items-start gap-2">
                <span className="mt-[6px] block w-[6px] h-[6px] rounded-full bg-rojo" />
                <span>
                  <span className="font-medium">{pendingLiq.length} marca(s)</span> con liquidación pendiente — {fmtMXN(pendingLiqTotal)}.
                </span>
              </li>
            )}
            {damaged.length > 0 && (
              <li className="flex items-start gap-2">
                <span className="mt-[6px] block w-[6px] h-[6px] rounded-full bg-rojo" />
                <span>
                  <span className="font-medium">{damaged.length} pieza(s)</span> marcadas como dañadas, pendientes de resolver.
                </span>
              </li>
            )}
            {stale.length > 0 && (
              <li className="flex items-start gap-2">
                <span className="mt-[6px] block w-[6px] h-[6px] rounded-full bg-rojo" />
                <span>
                  <span className="font-medium">{stale.length} pieza(s)</span> llevan más de 90 días en piso — considerar rotación.
                </span>
              </li>
            )}
            {reservedExpiring.length === 0 &&
              pendingLiq.length === 0 &&
              damaged.length === 0 &&
              stale.length === 0 && (
                <li className="text-rojo/60 font-light">Sin alertas. Buen ritmo.</li>
              )}
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <Eyebrow>movimientos recientes</Eyebrow>
        </div>
        {recentMoves.length === 0 ? (
          <Empty>Sin movimientos aún.</Empty>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <TH>Pieza</TH>
                <TH>Tipo</TH>
                <TH>Δ</TH>
                <TH>Usuario</TH>
                <TH>Fecha</TH>
                <TH>Nota</TH>
              </tr>
            </thead>
            <tbody>
              {recentMoves.map((m) => (
                <tr key={m.id}>
                  <TD className="font-medium">{m.pieceName}</TD>
                  <TD>
                    <Pill tone={m.qty > 0 ? "ok" : "neutral"}>{m.type.replaceAll("_", " ")}</Pill>
                  </TD>
                  <TD className={`tabular-nums ${m.qty > 0 ? "text-rojo" : "text-rojo/70"}`}>
                    {m.qty > 0 ? `+${m.qty}` : m.qty}
                  </TD>
                  <TD>{m.userName}</TD>
                  <TD>{fmtDate(m.createdAt)} · {fmtTime(m.createdAt)}</TD>
                  <TD className="text-rojo/60 font-light">{m.note || m.reason || "—"}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
