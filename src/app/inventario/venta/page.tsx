"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { fmtMXN, useStore } from "../_lib/store";
import { Button, Card, Empty, Eyebrow, Field, Input, Modal, PageHeader, Pill, Select } from "../_components/UI";
import PieceImage from "../_components/PieceImage";
import type { PaymentMethod, Piece } from "../_lib/types";

type CartItem = { piece: Piece; qty: number };

export default function VentaPage() {
  const { state, createSale } = useStore();
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>("efectivo");
  const [cashReceived, setCashReceived] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ folio: string; total: number } | null>(null);

  const available = useMemo(() => {
    return state.pieces.filter(
      (p) =>
        p.currentStock > 0 &&
        p.status !== "danada" &&
        p.status !== "prestada" &&
        p.status !== "devuelta_a_marca" &&
        p.status !== "retirada"
    );
  }, [state.pieces]);

  const filtered = available.filter((p) => {
    if (brandFilter && p.brandId !== brandFilter) return false;
    if (categoryFilter && p.category !== categoryFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      const brand = state.brands.find((b) => b.id === p.brandId);
      return (
        p.name.toLowerCase().includes(q) ||
        brand?.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const total = cart.reduce((t, c) => t + c.piece.price * c.qty, 0);

  const addToCart = (piece: Piece) => {
    if (piece.status === "reservada") {
      alert("Esta pieza está reservada. Convierte la reserva en venta desde Reservas.");
      return;
    }
    setCart((prev) => {
      const ex = prev.find((c) => c.piece.id === piece.id);
      if (ex) {
        if (ex.qty + 1 > piece.currentStock) return prev;
        return prev.map((c) => (c.piece.id === piece.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { piece, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((c) => c.piece.id !== id));

  const changeQty = (id: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.piece.id !== id) return c;
          const next = c.qty + delta;
          if (next < 1) return c;
          if (next > c.piece.currentStock) return c;
          return { ...c, qty: next };
        })
    );

  const openCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutOpen(true);
  };

  const cashNum = Number(cashReceived) || 0;
  const change = method === "efectivo" ? cashNum - total : 0;
  const canConfirm = !submitting && (method === "tarjeta" || cashNum >= total);

  const confirm = () => {
    if (!canConfirm) return;
    setSubmitting(true);
    const sale = createSale({
      cart,
      paymentMethod: method,
      cashReceived: method === "efectivo" ? cashNum : undefined,
    });
    setSuccess({ folio: sale.folio, total: sale.total });
    setCart([]);
    setCheckoutOpen(false);
    setCashReceived("");
    setMethod("efectivo");
    setSubmitting(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="punto de venta"
        title="Venta rápida"
        subtitle="Busca o filtra. Agrega al carrito. Cobra en menos de 20 segundos."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        <div>
          <Card className="p-4 mb-4 flex flex-col md:flex-row gap-3">
            <Input
              placeholder="Buscar pieza, marca o categoría…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="md:flex-1"
            />
            <Select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="md:w-[200px]"
            >
              <option value="">Todas las marcas</option>
              {state.brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="md:w-[180px]"
            >
              <option value="">Todas las categorías</option>
              <option value="ceramica">Cerámica</option>
              <option value="iluminacion">Iluminación</option>
              <option value="textil">Textil</option>
              <option value="escultura">Escultura</option>
              <option value="objeto">Objeto</option>
              <option value="mobiliario">Mobiliario</option>
              <option value="editorial">Editorial</option>
              <option value="vela">Vela</option>
            </Select>
          </Card>

          {filtered.length === 0 ? (
            <Empty>Sin piezas disponibles con esos filtros.</Empty>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((p) => {
                const brand = state.brands.find((b) => b.id === p.brandId);
                const inCart = cart.find((c) => c.piece.id === p.id);
                const reserved = p.status === "reservada";
                return (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p)}
                    disabled={reserved}
                    className={`group bg-blanco border text-left transition-colors ${
                      reserved
                        ? "border-rojo/15 opacity-60 cursor-not-allowed"
                        : "border-rojo/15 hover:border-rojo"
                    } ${inCart ? "ring-1 ring-rojo" : ""}`}
                  >
                    <div className="aspect-square bg-rojo/[0.03] flex items-center justify-center">
                      <PieceImage idx={p.imageIdx} size={140} />
                    </div>
                    <div className="px-3 py-3 border-t border-rojo/10">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div
                            className="text-rojo font-medium text-[13px] leading-tight truncate"
                            style={{ letterSpacing: "-0.01em" }}
                          >
                            {p.name}
                          </div>
                          <div className="text-[10px] tracking-[0.18em] uppercase text-rojo/60 mt-1 truncate">
                            {brand?.name}
                          </div>
                        </div>
                        <div className="text-rojo font-medium text-[13px] tabular-nums shrink-0">
                          {fmtMXN(p.price)}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        {p.isUnique && <Pill tone="rojo">única</Pill>}
                        {!p.isUnique && (
                          <Pill tone="off">stock {p.currentStock}</Pill>
                        )}
                        {reserved && <Pill tone="warn">reservada</Pill>}
                        {inCart && <Pill tone="ok">× {inCart.qty}</Pill>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart */}
        <Card className="p-5 h-fit sticky top-4">
          <Eyebrow>carrito</Eyebrow>
          {cart.length === 0 ? (
            <div className="mt-6 text-[12px] font-light text-rojo/60">
              Selecciona piezas para agregarlas al carrito.
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-rojo/10">
              {cart.map((c) => (
                <li key={c.piece.id} className="py-3 flex items-start gap-3">
                  <div className="w-12 h-12 bg-rojo/[0.03] flex items-center justify-center shrink-0">
                    <PieceImage idx={c.piece.imageIdx} size={42} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-rojo truncate leading-tight">
                      {c.piece.name}
                    </div>
                    <div className="text-[10px] tracking-[0.18em] uppercase text-rojo/60 mt-0.5">
                      {fmtMXN(c.piece.price)}
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      <button
                        onClick={() => changeQty(c.piece.id, -1)}
                        className="w-6 h-6 border border-rojo/30 text-rojo text-[11px] leading-none"
                      >
                        −
                      </button>
                      <span className="px-2 text-[12px] tabular-nums font-medium">{c.qty}</span>
                      <button
                        onClick={() => changeQty(c.piece.id, +1)}
                        className="w-6 h-6 border border-rojo/30 text-rojo text-[11px] leading-none"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(c.piece.id)}
                        className="ml-auto text-[10px] tracking-[0.18em] uppercase text-rojo/50 hover:text-rojo"
                      >
                        quitar
                      </button>
                    </div>
                  </div>
                  <div className="tabular-nums text-[13px] font-medium text-rojo shrink-0">
                    {fmtMXN(c.piece.price * c.qty)}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 pt-5 border-t border-rojo/15 flex items-end justify-between">
            <Eyebrow>total</Eyebrow>
            <div
              className="text-rojo font-medium tabular-nums"
              style={{ fontSize: "28px", letterSpacing: "-0.02em" }}
            >
              {fmtMXN(total)}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full mt-4"
            disabled={cart.length === 0}
            onClick={openCheckout}
          >
            cobrar
          </Button>
          {cart.length > 0 && (
            <button
              onClick={() => setCart([])}
              className="w-full mt-2 h-9 text-[10px] tracking-[0.2em] uppercase text-rojo/60 hover:text-rojo"
            >
              vaciar carrito
            </button>
          )}
        </Card>
      </div>

      {/* Checkout modal */}
      <Modal
        open={checkoutOpen}
        onClose={() => !submitting && setCheckoutOpen(false)}
        title="Cobrar"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCheckoutOpen(false)} disabled={submitting}>
              cancelar
            </Button>
            <Button variant="primary" onClick={confirm} disabled={!canConfirm}>
              {submitting ? "procesando…" : "confirmar venta"}
            </Button>
          </>
        }
      >
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-rojo/15">
          <Eyebrow>total a cobrar</Eyebrow>
          <div className="text-rojo font-medium tabular-nums" style={{ fontSize: 28 }}>
            {fmtMXN(total)}
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
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label="monto recibido">
              <Input
                type="number"
                inputMode="decimal"
                placeholder={String(total)}
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                autoFocus
              />
            </Field>
            <Field label="cambio">
              <div className="h-10 flex items-center px-3 border border-rojo/15 bg-rojo/[0.03] text-[13px] tabular-nums text-rojo">
                {change >= 0 ? fmtMXN(change) : "—"}
              </div>
            </Field>
          </div>
        )}

        <div className="mt-5 text-[11px] font-light text-rojo/60">
          Esta venta quedará registrada con folio, fecha, hora y usuario. No podrá borrarse.
        </div>
      </Modal>

      {/* Success */}
      <Modal
        open={!!success}
        onClose={() => setSuccess(null)}
        title="Venta registrada"
        footer={
          <>
            <Link
              href="/inventario/ventas"
              className="h-10 px-4 inline-flex items-center text-[11px] tracking-[0.2em] uppercase border border-rojo/30 text-rojo hover:bg-rojo/5"
            >
              ver ventas
            </Link>
            <Button variant="primary" onClick={() => setSuccess(null)}>
              continuar
            </Button>
          </>
        }
      >
        {success && (
          <div className="text-center py-4">
            <div className="text-[10px] tracking-[0.22em] uppercase text-rojo/60 mb-2">folio</div>
            <div className="text-rojo font-medium" style={{ fontSize: 32, letterSpacing: "-0.02em" }}>
              {success.folio}
            </div>
            <div className="mt-4 text-[10px] tracking-[0.22em] uppercase text-rojo/60">total</div>
            <div className="text-rojo font-medium tabular-nums" style={{ fontSize: 24 }}>
              {fmtMXN(success.total)}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
