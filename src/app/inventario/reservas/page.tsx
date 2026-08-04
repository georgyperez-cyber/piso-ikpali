"use client";

import { useMemo, useState } from "react";
import { fmtDate, fmtMXN, useStore } from "../_lib/store";
import { Button, Card, Empty, Eyebrow, Field, Input, Modal, PageHeader, Pill, Select, Stat, TD, TH, Textarea } from "../_components/UI";
import type { PaymentMethod } from "../_lib/types";

export default function ReservasPage() {
  const { state, createReservation, cancelReservation, convertReservationToSale } = useStore();
  const [newOpen, setNewOpen] = useState(false);
  const [convertId, setConvertId] = useState<string | null>(null);

  // new
  const [pieceId, setPieceId] = useState("");
  const [customer, setCustomer] = useState("");
  const [contact, setContact] = useState("");
  const [qty, setQty] = useState("1");
  const [days, setDays] = useState("5");
  const [note, setNote] = useState("");

  // convert
  const [method, setMethod] = useState<PaymentMethod>("efectivo");
  const [cashReceived, setCashReceived] = useState("");

  const reservations = state.reservations;
  const active = reservations.filter((r) => r.status === "activa");
  const expired = reservations.filter((r) => r.status === "activa" && new Date(r.expiresAt).getTime() < Date.now());
  const converted = reservations.filter((r) => r.status === "convertida");
  const cancelled = reservations.filter((r) => r.status === "cancelada");

  const reservablePieces = useMemo(
    () =>
      state.pieces.filter(
        (p) =>
          p.currentStock > 0 &&
          p.status !== "danada" &&
          p.status !== "reservada" &&
          p.status !== "vendida"
      ),
    [state.pieces]
  );

  const submit = () => {
    const n = Math.max(1, Number(qty) || 1);
    if (!pieceId || !customer.trim()) return;
    const piece = state.pieces.find((p) => p.id === pieceId)!;
    const expiresAt = new Date(Date.now() + (Number(days) || 5) * 86400000).toISOString();
    createReservation({
      pieceId,
      pieceName: piece.name,
      customerName: customer.trim(),
      customerContact: contact.trim() || undefined,
      qty: n,
      reservedBy: "—",
      expiresAt,
      note: note.trim() || undefined,
    });
    setNewOpen(false);
    setPieceId("");
    setCustomer("");
    setContact("");
    setQty("1");
    setDays("5");
    setNote("");
  };

  const convertNow = () => {
    if (!convertId) return;
    const res = reservations.find((r) => r.id === convertId);
    if (!res) return;
    const piece = state.pieces.find((p) => p.id === res.pieceId);
    if (!piece) return;
    const total = piece.price * res.qty;
    const cash = method === "efectivo" ? Number(cashReceived) : 0;
    if (method === "efectivo" && cash < total) return;
    convertReservationToSale(convertId, method, method === "efectivo" ? cash : undefined);
    setConvertId(null);
    setMethod("efectivo");
    setCashReceived("");
  };

  const convertRes = convertId ? reservations.find((r) => r.id === convertId) : null;
  const convertPiece = convertRes ? state.pieces.find((p) => p.id === convertRes.pieceId) : null;
  const convertTotal = convertPiece && convertRes ? convertPiece.price * convertRes.qty : 0;

  return (
    <div>
      <PageHeader
        eyebrow="apartados"
        title="Reservas"
        subtitle="Una pieza reservada no aparece como disponible para venta. Las reservas tienen fecha de expiración."
        right={<Button variant="primary" onClick={() => setNewOpen(true)}>nueva reserva</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="activas" value={active.length} sub={expired.length ? `${expired.length} vencidas` : "—"} />
        <Stat label="convertidas a venta" value={converted.length} />
        <Stat label="canceladas" value={cancelled.length} />
        <Stat label="piezas reservadas" value={state.pieces.filter((p) => p.status === "reservada").length} />
      </div>

      <Card className="p-5">
        <Eyebrow>todas</Eyebrow>
        {reservations.length === 0 ? (
          <div className="mt-3"><Empty>Sin reservas registradas.</Empty></div>
        ) : (
          <table className="w-full mt-3">
            <thead>
              <tr>
                <TH>Pieza</TH>
                <TH>Cliente</TH>
                <TH>Contacto</TH>
                <TH>Reserva</TH>
                <TH>Expira</TH>
                <TH>Estado</TH>
                <TH />
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => {
                const isExpired =
                  r.status === "activa" && new Date(r.expiresAt).getTime() < Date.now();
                return (
                  <tr key={r.id}>
                    <TD className="font-medium">{r.pieceName}</TD>
                    <TD>{r.customerName}</TD>
                    <TD className="text-rojo/70">{r.customerContact ?? "—"}</TD>
                    <TD>{fmtDate(r.reservedAt)}</TD>
                    <TD>
                      <span className={isExpired ? "text-rojo font-medium" : ""}>
                        {fmtDate(r.expiresAt)} {isExpired ? "· vencida" : ""}
                      </span>
                    </TD>
                    <TD>
                      <Pill
                        tone={
                          r.status === "activa"
                            ? isExpired
                              ? "warn"
                              : "ok"
                            : "off"
                        }
                      >
                        {r.status}
                      </Pill>
                    </TD>
                    <TD className="text-right">
                      {r.status === "activa" ? (
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => setConvertId(r.id)}
                            className="text-[10px] tracking-[0.2em] uppercase text-rojo hover:underline"
                          >
                            convertir →
                          </button>
                          <span className="text-rojo/30">·</span>
                          <button
                            onClick={() => {
                              if (confirm("¿Cancelar esta reserva?")) cancelReservation(r.id);
                            }}
                            className="text-[10px] tracking-[0.2em] uppercase text-rojo/60 hover:text-rojo"
                          >
                            cancelar
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] tracking-[0.2em] uppercase text-rojo/40">—</span>
                      )}
                    </TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      {/* New reservation modal */}
      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="Nueva reserva"
        footer={
          <>
            <Button variant="ghost" onClick={() => setNewOpen(false)}>cancelar</Button>
            <Button variant="primary" onClick={submit} disabled={!pieceId || !customer.trim()}>
              reservar
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Field label="pieza">
              <Select value={pieceId} onChange={(e) => setPieceId(e.target.value)}>
                <option value="">— seleccionar —</option>
                {reservablePieces.map((p) => {
                  const brand = state.brands.find((b) => b.id === p.brandId);
                  return (
                    <option key={p.id} value={p.id}>
                      {p.name} · {brand?.name} · {fmtMXN(p.price)}
                    </option>
                  );
                })}
              </Select>
            </Field>
          </div>
          <Field label="cliente">
            <Input value={customer} onChange={(e) => setCustomer(e.target.value)} />
          </Field>
          <Field label="contacto">
            <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="tel o instagram" />
          </Field>
          <Field label="cantidad">
            <Input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
          </Field>
          <Field label="días de vigencia">
            <Input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} />
          </Field>
          <div className="col-span-2">
            <Field label="nota">
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Pasa el viernes a recoger…" />
            </Field>
          </div>
        </div>
      </Modal>

      {/* Convert to sale */}
      <Modal
        open={!!convertId}
        onClose={() => setConvertId(null)}
        title="Convertir reserva en venta"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConvertId(null)}>cancelar</Button>
            <Button
              variant="primary"
              onClick={convertNow}
              disabled={method === "efectivo" && Number(cashReceived) < convertTotal}
            >
              confirmar venta
            </Button>
          </>
        }
      >
        {convertRes && convertPiece ? (
          <div>
            <div className="mb-5 pb-5 border-b border-rojo/15">
              <div className="text-[11px] tracking-[0.2em] uppercase text-rojo/60">cliente</div>
              <div className="text-rojo font-medium text-[15px] mt-1">{convertRes.customerName}</div>
              <div className="text-[11px] text-rojo/60 mt-2">{convertPiece.name} · {convertRes.qty} ud</div>
            </div>
            <div className="flex items-center justify-between mb-5">
              <Eyebrow>total</Eyebrow>
              <div className="text-rojo font-medium tabular-nums" style={{ fontSize: 26 }}>
                {fmtMXN(convertTotal)}
              </div>
            </div>
            <Field label="método de pago">
              <div className="grid grid-cols-2 gap-2">
                {(["efectivo", "tarjeta"] as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`h-11 border text-[12px] tracking-[0.18em] uppercase ${
                      method === m
                        ? "bg-rojo text-blanco border-rojo"
                        : "bg-blanco text-rojo border-rojo/30 hover:bg-rojo/5"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </Field>
            {method === "efectivo" && (
              <div className="mt-4">
                <Field label="monto recibido">
                  <Input type="number" value={cashReceived} onChange={(e) => setCashReceived(e.target.value)} />
                </Field>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
