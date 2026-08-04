"use client";

import { useMemo, useState } from "react";
import { fmtDate, fmtTime, useStore } from "../_lib/store";
import { Button, Card, Empty, Eyebrow, Field, Input, Modal, PageHeader, Pill, Select, TD, TH, Textarea } from "../_components/UI";
import type { Category, Piece } from "../_lib/types";

const REASONS = [
  ["nueva_consignacion", "Nueva consignación"],
  ["reposicion", "Reposición de stock"],
  ["compra_directa", "Compra directa"],
  ["pieza_propia", "Pieza propia"],
  ["reingreso_de_prestamo", "Regreso de préstamo"],
  ["devolucion_cliente", "Devolución de cliente"],
  ["ajuste_positivo", "Ajuste positivo"],
] as const;

export default function EntradasPage() {
  const { state, recordEntry, upsertPiece } = useStore();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"existing" | "new">("existing");

  // existing piece form
  const [pieceId, setPieceId] = useState("");
  const [qty, setQty] = useState("1");
  const [reason, setReason] = useState<string>("reposicion");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  // new piece form
  const [newName, setNewName] = useState("");
  const [newBrand, setNewBrand] = useState(state.brands[0]?.id ?? "");
  const [newCategory, setNewCategory] = useState<Category>("ceramica");
  const [newPrice, setNewPrice] = useState("");
  const [newUnique, setNewUnique] = useState(false);
  const [newStock, setNewStock] = useState("1");
  const [newImage, setNewImage] = useState(1);

  const entries = useMemo(
    () => state.movements.filter((m) => m.type === "entrada").slice(0, 50),
    [state.movements]
  );

  const reset = () => {
    setPieceId("");
    setQty("1");
    setReason("reposicion");
    setLocation("");
    setNote("");
    setNewName("");
    setNewPrice("");
    setNewUnique(false);
    setNewStock("1");
    setMode("existing");
  };

  const submit = () => {
    if (mode === "existing") {
      const n = Math.max(1, Number(qty) || 0);
      if (!pieceId || n < 1) return;
      recordEntry({ pieceId, qty: n, reason, note, location: location || undefined });
    } else {
      const brand = state.brands.find((b) => b.id === newBrand);
      if (!brand || !newName.trim()) return;
      const stock = Math.max(1, Number(newStock) || 1);
      const price = Math.max(0, Number(newPrice) || 0);
      const id = `p-${Date.now().toString(36)}`;
      const piece: Piece = {
        id,
        name: newName.trim(),
        brandId: brand.id,
        category: newCategory,
        imageIdx: newImage,
        price,
        brandPct: brand.brandPct,
        pisoPct: brand.pisoPct,
        initialStock: stock,
        currentStock: 0, // recordEntry will add
        isUnique: newUnique,
        isConsignment: brand.model === "consignacion",
        status: "en_piso",
        location: location || undefined,
        entryDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      upsertPiece(piece);
      // immediate entry to add stock & create movement
      setTimeout(() => {
        recordEntry({
          pieceId: id,
          qty: stock,
          reason: "nueva_consignacion",
          note: note || `Pieza creada: ${piece.name}`,
          location: location || undefined,
        });
      }, 0);
    }
    setOpen(false);
    reset();
  };

  return (
    <div>
      <PageHeader
        eyebrow="inventario · in"
        title="Entradas"
        subtitle="Registra cada pieza que entra al espacio. Cada entrada deja folio, usuario y motivo."
        right={<Button variant="primary" onClick={() => setOpen(true)}>nueva entrada</Button>}
      />

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <Eyebrow>últimas entradas</Eyebrow>
        </div>
        {entries.length === 0 ? (
          <Empty>Sin entradas registradas.</Empty>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <TH>Fecha</TH>
                <TH>Pieza</TH>
                <TH>Motivo</TH>
                <TH>Cantidad</TH>
                <TH>Stock después</TH>
                <TH>Usuario</TH>
                <TH>Nota</TH>
              </tr>
            </thead>
            <tbody>
              {entries.map((m) => (
                <tr key={m.id}>
                  <TD>{fmtDate(m.createdAt)} · {fmtTime(m.createdAt)}</TD>
                  <TD className="font-medium">{m.pieceName}</TD>
                  <TD>
                    <Pill tone="ok">{(m.reason ?? "").replaceAll("_", " ") || "—"}</Pill>
                  </TD>
                  <TD className="tabular-nums text-rojo">+{m.qty}</TD>
                  <TD className="tabular-nums">{m.stockAfter}</TD>
                  <TD>{m.userName}</TD>
                  <TD className="text-rojo/60 font-light">{m.note ?? "—"}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        title="Registrar entrada"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setOpen(false); reset(); }}>cancelar</Button>
            <Button variant="primary" onClick={submit}>confirmar entrada</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => setMode("existing")}
            className={`h-10 border text-[11px] tracking-[0.18em] uppercase ${
              mode === "existing"
                ? "bg-rojo text-blanco border-rojo"
                : "bg-blanco text-rojo border-rojo/30 hover:bg-rojo/5"
            }`}
          >
            pieza existente
          </button>
          <button
            onClick={() => setMode("new")}
            className={`h-10 border text-[11px] tracking-[0.18em] uppercase ${
              mode === "new"
                ? "bg-rojo text-blanco border-rojo"
                : "bg-blanco text-rojo border-rojo/30 hover:bg-rojo/5"
            }`}
          >
            nueva pieza
          </button>
        </div>

        {mode === "existing" ? (
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
            <Field label="cantidad">
              <Input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
            </Field>
            <Field label="motivo">
              <Select value={reason} onChange={(e) => setReason(e.target.value)}>
                {REASONS.map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </Select>
            </Field>
            <Field label="ubicación">
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Mesa B, Vitrina, …" />
            </Field>
            <div className="col-span-2">
              <Field label="nota">
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Observaciones, lote, número de piezas revisadas…" />
              </Field>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Field label="nombre de la pieza">
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Tazón anillo, lámpara torre…" />
              </Field>
            </div>
            <Field label="marca">
              <Select value={newBrand} onChange={(e) => setNewBrand(e.target.value)}>
                {state.brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="categoría">
              <Select value={newCategory} onChange={(e) => setNewCategory(e.target.value as Category)}>
                <option value="ceramica">Cerámica</option>
                <option value="iluminacion">Iluminación</option>
                <option value="textil">Textil</option>
                <option value="escultura">Escultura</option>
                <option value="objeto">Objeto</option>
                <option value="mobiliario">Mobiliario</option>
                <option value="editorial">Editorial</option>
                <option value="vela">Vela</option>
              </Select>
            </Field>
            <Field label="precio de venta (mxn)">
              <Input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="1450"
              />
            </Field>
            <Field label="stock inicial">
              <Input
                type="number"
                min="1"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                disabled={newUnique}
              />
            </Field>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isUnique"
                checked={newUnique}
                onChange={(e) => {
                  setNewUnique(e.target.checked);
                  if (e.target.checked) setNewStock("1");
                }}
                className="accent-rojo"
              />
              <label htmlFor="isUnique" className="text-[12px] text-rojo">
                Pieza única — no se repone
              </label>
            </div>
            <Field label="ubicación">
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </Field>
            <Field label="ícono visual">
              <Select value={String(newImage)} onChange={(e) => setNewImage(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <option key={i} value={i}>Ícono {i}</option>
                ))}
              </Select>
            </Field>
            <div className="col-span-2">
              <Field label="nota">
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
              </Field>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
