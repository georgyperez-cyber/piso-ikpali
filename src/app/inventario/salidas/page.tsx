"use client";

import { useMemo, useState } from "react";
import { fmtDate, fmtTime, useStore } from "../_lib/store";
import { Button, Card, Empty, Eyebrow, Field, Input, Modal, PageHeader, Pill, Select, TD, TH, Textarea } from "../_components/UI";
import type { MovementType } from "../_lib/types";

const EXIT_TYPES: { value: MovementType; label: string; hint: string }[] = [
  { value: "devolucion_a_marca", label: "Devolución a marca", hint: "La pieza sale del inventario activo." },
  { value: "rotacion_curatorial", label: "Rotación curatorial", hint: "Se retira del piso. Conserva historial." },
  { value: "danada", label: "Dañada", hint: "Sale de inventario vendible." },
  { value: "prestada", label: "Préstamo (foto, montaje)", hint: "Sale temporalmente del piso." },
  { value: "ajuste", label: "Ajuste manual", hint: "Diferencia de conteo. Requiere motivo claro." },
];

export default function SalidasPage() {
  const { state, recordExit } = useStore();
  const [open, setOpen] = useState(false);
  const [pieceId, setPieceId] = useState("");
  const [type, setType] = useState<MovementType>("devolucion_a_marca");
  const [qty, setQty] = useState("1");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const exits = useMemo(
    () =>
      state.movements
        .filter((m) =>
          [
            "devolucion_a_marca",
            "rotacion_curatorial",
            "danada",
            "prestada",
            "ajuste",
          ].includes(m.type)
        )
        .slice(0, 50),
    [state.movements]
  );

  const piece = state.pieces.find((p) => p.id === pieceId);

  const submit = () => {
    const n = Math.max(1, Number(qty) || 0);
    if (!pieceId || !reason.trim() || n < 1) return;
    if (piece && n > piece.currentStock + piece.initialStock) return;
    recordExit({ pieceId, qty: n, type, reason: reason.trim(), note });
    setOpen(false);
    setPieceId("");
    setType("devolucion_a_marca");
    setQty("1");
    setReason("");
    setNote("");
  };

  return (
    <div>
      <PageHeader
        eyebrow="inventario · out"
        title="Salidas"
        subtitle="Toda salida que no sea venta deja motivo: devolución, daño, préstamo, rotación, ajuste."
        right={<Button variant="primary" onClick={() => setOpen(true)}>nueva salida</Button>}
      />

      <Card className="p-5">
        <Eyebrow>últimas salidas</Eyebrow>
        {exits.length === 0 ? (
          <div className="mt-3"><Empty>Sin salidas registradas.</Empty></div>
        ) : (
          <table className="w-full mt-3">
            <thead>
              <tr>
                <TH>Fecha</TH>
                <TH>Pieza</TH>
                <TH>Tipo</TH>
                <TH>Cantidad</TH>
                <TH>Stock después</TH>
                <TH>Usuario</TH>
                <TH>Motivo</TH>
              </tr>
            </thead>
            <tbody>
              {exits.map((m) => (
                <tr key={m.id}>
                  <TD>{fmtDate(m.createdAt)} · {fmtTime(m.createdAt)}</TD>
                  <TD className="font-medium">{m.pieceName}</TD>
                  <TD>
                    <Pill tone={m.type === "danada" ? "warn" : "neutral"}>
                      {m.type.replaceAll("_", " ")}
                    </Pill>
                  </TD>
                  <TD className="tabular-nums">{m.qty}</TD>
                  <TD className="tabular-nums">{m.stockAfter}</TD>
                  <TD>{m.userName}</TD>
                  <TD className="text-rojo/70 font-light">{m.reason || m.note || "—"}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Registrar salida"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>cancelar</Button>
            <Button variant="primary" onClick={submit} disabled={!pieceId || !reason.trim()}>
              confirmar salida
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Field label="pieza">
              <Select value={pieceId} onChange={(e) => setPieceId(e.target.value)}>
                <option value="">— seleccionar —</option>
                {state.pieces.map((p) => {
                  const brand = state.brands.find((b) => b.id === p.brandId);
                  return (
                    <option key={p.id} value={p.id}>
                      {p.name} · {brand?.name} · stock {p.currentStock}
                    </option>
                  );
                })}
              </Select>
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="tipo de salida">
              <Select value={type} onChange={(e) => setType(e.target.value as MovementType)}>
                {EXIT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </Field>
            <p className="text-[11px] text-rojo/60 mt-1 font-light">
              {EXIT_TYPES.find((t) => t.value === type)?.hint}
            </p>
          </div>
          <Field label="cantidad">
            <Input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
          </Field>
          <div className="col-span-2">
            <Field label="motivo (requerido)">
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Roto en limpieza, préstamo a editorial, devolución acordada con marca…"
              />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="nota">
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}
