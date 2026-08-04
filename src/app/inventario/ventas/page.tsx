"use client";

import { useMemo, useState } from "react";
import { fmtDate, fmtMXN, fmtTime, isToday, useStore } from "../_lib/store";
import { Button, Card, Empty, Eyebrow, Modal, PageHeader, Pill, Stat, TD, TH } from "../_components/UI";
import type { Sale } from "../_lib/types";

export default function VentasPage() {
  const { state, currentUser, cancelSale } = useStore();
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<"todos" | "efectivo" | "tarjeta" | "canceladas">("todos");
  const [detail, setDetail] = useState<Sale | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const list = useMemo(() => {
    let result = state.sales;
    if (!showAll) result = result.filter((s) => isToday(s.createdAt));
    if (filter === "efectivo") result = result.filter((s) => s.paymentMethod === "efectivo" && s.status === "completada");
    else if (filter === "tarjeta") result = result.filter((s) => s.paymentMethod === "tarjeta" && s.status === "completada");
    else if (filter === "canceladas") result = result.filter((s) => s.status === "cancelada");
    return result;
  }, [state.sales, filter, showAll]);

  const totals = useMemo(() => {
    const completed = list.filter((s) => s.status === "completada");
    return {
      total: completed.reduce((t, s) => t + s.total, 0),
      cash: completed.filter((s) => s.paymentMethod === "efectivo").reduce((t, s) => t + s.total, 0),
      card: completed.filter((s) => s.paymentMethod === "tarjeta").reduce((t, s) => t + s.total, 0),
      count: completed.length,
      cancelled: list.filter((s) => s.status === "cancelada").length,
      pieces: completed.reduce((t, s) => t + s.items.reduce((q, i) => q + i.qty, 0), 0),
    };
  }, [list]);

  return (
    <div>
      <PageHeader
        eyebrow={showAll ? "historial completo" : "operación de hoy"}
        title={showAll ? "Todas las ventas" : "Ventas del día"}
        subtitle="Cada venta tiene folio, usuario y método de pago. Las canceladas se conservan con motivo."
        right={
          <Button onClick={() => setShowAll(!showAll)}>
            {showAll ? "ver hoy" : "ver historial"}
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <Stat label="total" value={fmtMXN(totals.total)} />
        <Stat label="efectivo" value={fmtMXN(totals.cash)} />
        <Stat label="tarjeta" value={fmtMXN(totals.card)} />
        <Stat label="tickets" value={totals.count} />
        <Stat label="piezas" value={totals.pieces} />
        <Stat label="canceladas" value={totals.cancelled} />
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4 gap-3">
          <Eyebrow>movimiento</Eyebrow>
          <div className="flex gap-1">
            {(["todos", "efectivo", "tarjeta", "canceladas"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`h-8 px-3 text-[10px] tracking-[0.18em] uppercase border ${
                  filter === f
                    ? "bg-rojo text-blanco border-rojo"
                    : "bg-blanco text-rojo/70 border-rojo/30 hover:bg-rojo/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <Empty>Sin ventas con este filtro.</Empty>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <TH>Folio</TH>
                <TH>Fecha</TH>
                <TH>Hora</TH>
                <TH>Usuario</TH>
                <TH>Piezas</TH>
                <TH>Método</TH>
                <TH>Estado</TH>
                <TH className="text-right">Total</TH>
                <TH />
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className="hover:bg-rojo/[0.02]">
                  <TD className="font-medium">{s.folio}</TD>
                  <TD>{fmtDate(s.createdAt)}</TD>
                  <TD>{fmtTime(s.createdAt)}</TD>
                  <TD>{s.userName}</TD>
                  <TD className="tabular-nums">
                    {s.items.reduce((q, i) => q + i.qty, 0)}
                  </TD>
                  <TD>
                    <Pill tone={s.paymentMethod === "efectivo" ? "ok" : "neutral"}>
                      {s.paymentMethod}
                    </Pill>
                  </TD>
                  <TD>
                    <Pill tone={s.status === "completada" ? "ok" : "off"}>
                      {s.status}
                    </Pill>
                  </TD>
                  <TD className="text-right tabular-nums font-medium">{fmtMXN(s.total)}</TD>
                  <TD className="text-right">
                    <button
                      onClick={() => setDetail(s)}
                      className="text-[10px] tracking-[0.2em] uppercase text-rojo/70 hover:text-rojo"
                    >
                      detalle →
                    </button>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Detail modal */}
      <Modal
        open={!!detail}
        onClose={() => {
          setDetail(null);
          setCancelOpen(false);
        }}
        title={detail ? `Venta ${detail.folio}` : ""}
        footer={
          detail && detail.status === "completada" && currentUser.role !== "empleado" ? (
            <>
              <Button variant="ghost" onClick={() => setDetail(null)}>
                cerrar
              </Button>
              <Button variant="danger" onClick={() => setCancelOpen(true)}>
                cancelar venta
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => setDetail(null)}>
              cerrar
            </Button>
          )
        }
      >
        {detail && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-rojo/15 text-[12px]">
              <div>
                <Eyebrow>fecha</Eyebrow>
                <div className="mt-1">{fmtDate(detail.createdAt)} · {fmtTime(detail.createdAt)}</div>
              </div>
              <div>
                <Eyebrow>usuario</Eyebrow>
                <div className="mt-1">{detail.userName}</div>
              </div>
              <div>
                <Eyebrow>método</Eyebrow>
                <div className="mt-1 capitalize">{detail.paymentMethod}</div>
              </div>
              <div>
                <Eyebrow>estado</Eyebrow>
                <div className="mt-1 capitalize">{detail.status}</div>
              </div>
            </div>

            <Eyebrow>piezas</Eyebrow>
            <ul className="mt-2 divide-y divide-rojo/10">
              {detail.items.map((it, idx) => (
                <li key={idx} className="py-2 flex items-center justify-between gap-3 text-[13px]">
                  <div className="min-w-0">
                    <div className="text-rojo font-medium truncate">{it.pieceName}</div>
                    <div className="text-[10px] tracking-[0.18em] uppercase text-rojo/60">
                      {it.brandName} · {it.qty} × {fmtMXN(it.unitPrice)}
                    </div>
                  </div>
                  <div className="tabular-nums shrink-0">{fmtMXN(it.lineTotal)}</div>
                </li>
              ))}
            </ul>

            <div className="mt-5 pt-5 border-t border-rojo/15 grid grid-cols-3 gap-3 text-[12px]">
              <div>
                <Eyebrow>marca</Eyebrow>
                <div className="mt-1 tabular-nums">
                  {fmtMXN(detail.items.reduce((t, i) => t + i.brandAmount, 0))}
                </div>
              </div>
              <div>
                <Eyebrow>piso ikpali</Eyebrow>
                <div className="mt-1 tabular-nums">
                  {fmtMXN(detail.items.reduce((t, i) => t + i.pisoAmount, 0))}
                </div>
              </div>
              <div className="text-right">
                <Eyebrow>total</Eyebrow>
                <div className="mt-1 tabular-nums text-rojo font-medium" style={{ fontSize: 18 }}>
                  {fmtMXN(detail.total)}
                </div>
              </div>
            </div>

            {detail.paymentMethod === "efectivo" && detail.cashReceived ? (
              <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
                <div>
                  <Eyebrow>recibido</Eyebrow>
                  <div className="mt-1 tabular-nums">{fmtMXN(detail.cashReceived)}</div>
                </div>
                <div className="text-right">
                  <Eyebrow>cambio</Eyebrow>
                  <div className="mt-1 tabular-nums">{fmtMXN(detail.change ?? 0)}</div>
                </div>
              </div>
            ) : null}

            {detail.status === "cancelada" && (
              <div className="mt-5 border border-rojo/30 bg-rojo/5 p-3 text-[12px]">
                <Eyebrow>motivo de cancelación</Eyebrow>
                <div className="mt-1 text-rojo/80">{detail.cancelReason || "—"}</div>
              </div>
            )}

            {cancelOpen && (
              <div className="mt-5 border-t border-rojo/15 pt-4">
                <Eyebrow>motivo (requerido)</Eyebrow>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Ej: pieza no entregada al cliente, error de cobro…"
                  className="w-full mt-2 border border-rojo/30 px-3 py-2 text-[13px] min-h-[60px] focus:outline-none focus:border-rojo"
                />
                <div className="flex gap-2 mt-3 justify-end">
                  <Button variant="ghost" onClick={() => setCancelOpen(false)}>
                    no, mantener
                  </Button>
                  <Button
                    variant="danger"
                    disabled={cancelReason.trim().length < 3}
                    onClick={() => {
                      cancelSale(detail.id, cancelReason.trim());
                      setCancelOpen(false);
                      setDetail(null);
                      setCancelReason("");
                    }}
                  >
                    confirmar cancelación
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
