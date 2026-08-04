"use client";

import { useMemo, useState } from "react";
import { fmtDate, fmtMXN, fmtTime, isToday, useStore } from "../_lib/store";
import { Button, Card, Empty, Eyebrow, Field, Input, Modal, PageHeader, Pill, Select, Stat, TD, TH, Textarea } from "../_components/UI";

export default function CajaPage() {
  const { state, openShift, closeShift, addCashMovement } = useStore();
  const [openModal, setOpenModal] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [moveModal, setMoveModal] = useState<null | "entrada" | "salida">(null);

  const [openingCash, setOpeningCash] = useState("1500");
  const [countedCash, setCountedCash] = useState("");
  const [closeNote, setCloseNote] = useState("");

  const [moveAmount, setMoveAmount] = useState("");
  const [moveReason, setMoveReason] = useState("");
  const [moveNote, setMoveNote] = useState("");

  const openShiftActive = state.shifts.find((s) => s.status === "abierta");
  const ofShift = openShiftActive?.id;

  const shiftOpenedAt = openShiftActive?.openedAt;
  const todaySales = useMemo(
    () =>
      state.sales.filter((s) => {
        if (s.status !== "completada") return false;
        if (!ofShift) return isToday(s.createdAt);
        // Belongs to current shift, OR created after shift open without an assigned shift
        if (s.shiftId === ofShift) return true;
        if (!s.shiftId && shiftOpenedAt && new Date(s.createdAt) >= new Date(shiftOpenedAt))
          return true;
        return false;
      }),
    [state.sales, ofShift, shiftOpenedAt]
  );
  const cashSales = todaySales
    .filter((s) => s.paymentMethod === "efectivo")
    .reduce((t, s) => t + s.total, 0);
  const cardSales = todaySales
    .filter((s) => s.paymentMethod === "tarjeta")
    .reduce((t, s) => t + s.total, 0);

  const shiftMoves = state.cashMovements.filter((m) => m.shiftId === ofShift);
  const cashIn = shiftMoves.filter((m) => m.type === "entrada").reduce((t, m) => t + m.amount, 0);
  const cashOut = shiftMoves.filter((m) => m.type === "salida").reduce((t, m) => t + m.amount, 0);

  const opening = openShiftActive?.openingCash ?? 0;
  const expectedCash = opening + cashSales + cashIn - cashOut;
  const counted = Number(countedCash) || 0;
  const diff = counted - expectedCash;

  const closedShifts = state.shifts.filter((s) => s.status === "cerrada").slice(0, 10);

  const submitOpen = () => {
    openShift(Math.max(0, Number(openingCash) || 0));
    setOpenModal(false);
  };

  const submitClose = () => {
    closeShift(counted, closeNote || undefined);
    setCloseModal(false);
    setCountedCash("");
    setCloseNote("");
  };

  const submitMove = () => {
    if (!moveModal) return;
    const amount = Math.max(0, Number(moveAmount) || 0);
    if (amount <= 0 || !moveReason.trim()) return;
    addCashMovement({
      type: moveModal,
      amount,
      reason: moveReason.trim(),
      note: moveNote || undefined,
    });
    setMoveModal(null);
    setMoveAmount("");
    setMoveReason("");
    setMoveNote("");
  };

  return (
    <div>
      <PageHeader
        eyebrow="caja · turno"
        title="Caja"
        subtitle="Apertura, cierre y movimientos de efectivo. La fórmula es estricta: lo que entra menos lo que sale."
        right={
          openShiftActive ? (
            <Button variant="primary" onClick={() => setCloseModal(true)}>cerrar caja</Button>
          ) : (
            <Button variant="primary" onClick={() => setOpenModal(true)}>abrir caja</Button>
          )
        }
      />

      {openShiftActive ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Stat label="fondo inicial" value={fmtMXN(opening)} sub={`${openShiftActive.openedByName} · ${fmtTime(openShiftActive.openedAt)}`} />
            <Stat label="ventas efectivo" value={fmtMXN(cashSales)} sub={`${todaySales.filter((s) => s.paymentMethod === "efectivo").length} tickets`} />
            <Stat label="ventas tarjeta" value={fmtMXN(cardSales)} sub={`${todaySales.filter((s) => s.paymentMethod === "tarjeta").length} tickets`} />
            <Stat
              label="efectivo esperado"
              value={fmtMXN(expectedCash)}
              sub={`+${fmtMXN(cashIn)} entradas · −${fmtMXN(cashOut)} salidas`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3 mb-6">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <Eyebrow>movimientos del turno</Eyebrow>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setMoveModal("entrada")}>+ entrada</Button>
                  <Button size="sm" onClick={() => setMoveModal("salida")}>− salida</Button>
                </div>
              </div>
              {shiftMoves.length === 0 ? (
                <Empty>Sin movimientos de efectivo además de ventas.</Empty>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr>
                      <TH>Hora</TH>
                      <TH>Tipo</TH>
                      <TH>Motivo</TH>
                      <TH>Usuario</TH>
                      <TH className="text-right">Monto</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {shiftMoves.map((m) => (
                      <tr key={m.id}>
                        <TD>{fmtTime(m.createdAt)}</TD>
                        <TD>
                          <Pill tone={m.type === "entrada" ? "ok" : "warn"}>{m.type}</Pill>
                        </TD>
                        <TD>{m.reason}</TD>
                        <TD>{m.userName}</TD>
                        <TD className={`text-right tabular-nums ${m.type === "salida" ? "text-rojo" : ""}`}>
                          {m.type === "salida" ? "−" : "+"}{fmtMXN(m.amount)}
                        </TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>

            <Card className="p-5">
              <Eyebrow>fórmula del turno</Eyebrow>
              <div className="mt-4 space-y-2 text-[12px] font-light">
                <Row label="Fondo inicial" v={fmtMXN(opening)} />
                <Row label="+ Ventas efectivo" v={fmtMXN(cashSales)} />
                <Row label="+ Entradas" v={fmtMXN(cashIn)} />
                <Row label="− Salidas" v={`−${fmtMXN(cashOut)}`} />
                <div className="my-3 border-t border-rojo/15" />
                <Row strong label="Efectivo esperado" v={fmtMXN(expectedCash)} />
              </div>
              <div className="mt-5 text-[11px] text-rojo/60 font-light">
                Las ventas con tarjeta NO suman al efectivo esperado pero se reportan en el cierre.
              </div>
            </Card>
          </div>
        </>
      ) : (
        <Card className="p-10 text-center mb-6">
          <Eyebrow>caja cerrada</Eyebrow>
          <p className="mt-3 text-[13px] text-rojo/70 font-light max-w-[400px] mx-auto">
            Abre la caja para empezar el turno. Sin caja abierta, las ventas en efectivo no entran al corte.
          </p>
          <div className="mt-5">
            <Button variant="primary" onClick={() => setOpenModal(true)}>
              abrir caja
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-5">
        <Eyebrow>cortes anteriores</Eyebrow>
        {closedShifts.length === 0 ? (
          <div className="mt-3"><Empty>Sin cortes cerrados aún.</Empty></div>
        ) : (
          <table className="w-full mt-3">
            <thead>
              <tr>
                <TH>Apertura</TH>
                <TH>Cierre</TH>
                <TH>Abrió</TH>
                <TH>Cerró</TH>
                <TH>Fondo</TH>
                <TH>Contado</TH>
                <TH>Diferencia</TH>
                <TH>Notas</TH>
              </tr>
            </thead>
            <tbody>
              {closedShifts.map((sh) => {
                const sales = state.sales.filter(
                  (s) => s.status === "completada" && s.shiftId === sh.id
                );
                const cash = sales.filter((s) => s.paymentMethod === "efectivo").reduce((t, s) => t + s.total, 0);
                const moves = state.cashMovements.filter((m) => m.shiftId === sh.id);
                const ci = moves.filter((m) => m.type === "entrada").reduce((t, m) => t + m.amount, 0);
                const co = moves.filter((m) => m.type === "salida").reduce((t, m) => t + m.amount, 0);
                const expected = sh.openingCash + cash + ci - co;
                const d = (sh.countedCash ?? 0) - expected;
                return (
                  <tr key={sh.id}>
                    <TD>{fmtDate(sh.openedAt)} · {fmtTime(sh.openedAt)}</TD>
                    <TD>{sh.closedAt ? `${fmtDate(sh.closedAt)} · ${fmtTime(sh.closedAt)}` : "—"}</TD>
                    <TD>{sh.openedByName}</TD>
                    <TD>{sh.closedByName ?? "—"}</TD>
                    <TD className="tabular-nums">{fmtMXN(sh.openingCash)}</TD>
                    <TD className="tabular-nums">{sh.countedCash != null ? fmtMXN(sh.countedCash) : "—"}</TD>
                    <TD className={`tabular-nums ${d !== 0 ? "text-rojo font-medium" : ""}`}>
                      {d === 0 ? "—" : fmtMXN(d)}
                    </TD>
                    <TD className="text-rojo/60 font-light">{sh.notes ?? "—"}</TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      {/* Open shift */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Abrir caja"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpenModal(false)}>cancelar</Button>
            <Button variant="primary" onClick={submitOpen}>abrir turno</Button>
          </>
        }
      >
        <Field label="fondo inicial (mxn)">
          <Input type="number" value={openingCash} onChange={(e) => setOpeningCash(e.target.value)} autoFocus />
        </Field>
        <p className="mt-3 text-[11px] text-rojo/60 font-light">
          El fondo inicial es el efectivo que ya está en la caja al empezar el turno.
        </p>
      </Modal>

      {/* Close shift */}
      <Modal
        open={closeModal}
        onClose={() => setCloseModal(false)}
        title="Cerrar caja"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCloseModal(false)}>cancelar</Button>
            <Button variant="primary" onClick={submitClose} disabled={countedCash === ""}>
              cerrar turno
            </Button>
          </>
        }
      >
        <div className="mb-5 pb-5 border-b border-rojo/15 space-y-2 text-[12px] font-light">
          <Row label="Fondo inicial" v={fmtMXN(opening)} />
          <Row label="+ Ventas efectivo" v={fmtMXN(cashSales)} />
          <Row label="+ Entradas" v={fmtMXN(cashIn)} />
          <Row label="− Salidas" v={`−${fmtMXN(cashOut)}`} />
          <Row strong label="Efectivo esperado" v={fmtMXN(expectedCash)} />
          <Row label="Ventas tarjeta (no afecta)" v={fmtMXN(cardSales)} />
        </div>
        <Field label="efectivo contado">
          <Input type="number" value={countedCash} onChange={(e) => setCountedCash(e.target.value)} autoFocus />
        </Field>
        {countedCash !== "" && (
          <div className={`mt-3 px-3 py-2 border ${diff === 0 ? "border-rojo/20 bg-rojo/[0.03]" : "border-rojo bg-rojo/10"}`}>
            <Eyebrow>diferencia</Eyebrow>
            <div className="mt-1 tabular-nums text-rojo font-medium" style={{ fontSize: 20 }}>
              {diff === 0 ? "Sin diferencia" : `${diff > 0 ? "+" : ""}${fmtMXN(diff)}`}
            </div>
          </div>
        )}
        <div className="mt-4">
          <Field label="nota de cierre">
            <Textarea value={closeNote} onChange={(e) => setCloseNote(e.target.value)} placeholder="Observaciones, justificación de diferencia…" />
          </Field>
        </div>
      </Modal>

      {/* Cash movement */}
      <Modal
        open={moveModal !== null}
        onClose={() => setMoveModal(null)}
        title={moveModal === "entrada" ? "Entrada de efectivo" : "Salida de efectivo"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setMoveModal(null)}>cancelar</Button>
            <Button variant="primary" onClick={submitMove} disabled={!moveAmount || !moveReason.trim()}>
              confirmar
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="monto">
            <Input type="number" value={moveAmount} onChange={(e) => setMoveAmount(e.target.value)} autoFocus />
          </Field>
          <Field label="motivo (requerido)">
            <Select value={moveReason} onChange={(e) => setMoveReason(e.target.value)}>
              <option value="">— seleccionar —</option>
              {moveModal === "entrada" ? (
                <>
                  <option value="fondo_adicional">Fondo adicional</option>
                  <option value="ajuste_positivo">Ajuste positivo</option>
                  <option value="reembolso_recibido">Reembolso recibido</option>
                  <option value="otro">Otro</option>
                </>
              ) : (
                <>
                  <option value="compra_operativa">Compra operativa</option>
                  <option value="pago_proveedor">Pago a proveedor</option>
                  <option value="retiro_parcial">Retiro parcial</option>
                  <option value="cambio">Cambio</option>
                  <option value="ajuste_negativo">Ajuste negativo</option>
                  <option value="otro">Otro</option>
                </>
              )}
            </Select>
          </Field>
          <div className="col-span-2">
            <Field label="nota">
              <Textarea value={moveNote} onChange={(e) => setMoveNote(e.target.value)} />
            </Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Row({ label, v, strong }: { label: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[11px] tracking-[0.18em] uppercase ${strong ? "text-rojo" : "text-rojo/60"}`}>
        {label}
      </span>
      <span className={`tabular-nums ${strong ? "text-rojo font-medium text-[15px]" : "text-rojo/85"}`}>
        {v}
      </span>
    </div>
  );
}
