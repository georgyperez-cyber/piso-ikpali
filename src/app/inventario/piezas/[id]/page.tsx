"use client";

import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { fmtDate, fmtMXN, fmtTime, useStore } from "../../_lib/store";
import { Card, Empty, Eyebrow, PageHeader, Pill, TD, TH } from "../../_components/UI";
import PieceImage from "../../_components/PieceImage";

export default function PiezaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { state } = useStore();

  const piece = state.pieces.find((p) => p.id === id);
  if (!piece) return notFound();

  const brand = state.brands.find((b) => b.id === piece.brandId);
  const movements = state.movements
    .filter((m) => m.pieceId === piece.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const sales = state.sales
    .filter((s) => s.items.some((i) => i.pieceId === piece.id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <div className="text-[10px] tracking-[0.2em] uppercase text-rojo/60 mb-4">
        <Link href="/inventario/piezas" className="hover:text-rojo">
          ← piezas
        </Link>
      </div>

      <PageHeader
        eyebrow={brand?.name ?? "—"}
        title={piece.name}
        subtitle={piece.curatorialNote || piece.shortDescription}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 mb-8">
        <Card className="p-6 flex items-center justify-center bg-rojo/[0.03]">
          <PieceImage idx={piece.imageIdx} size={280} />
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Card className="p-4">
            <Eyebrow>precio</Eyebrow>
            <div className="mt-2 text-rojo font-medium tabular-nums" style={{ fontSize: 26 }}>
              {fmtMXN(piece.price)}
            </div>
          </Card>
          <Card className="p-4">
            <Eyebrow>stock actual</Eyebrow>
            <div className="mt-2 text-rojo font-medium tabular-nums" style={{ fontSize: 26 }}>
              {piece.currentStock}
            </div>
            <div className="text-[11px] text-rojo/60 font-light">
              de {piece.initialStock} inicial{piece.isUnique ? " · única" : ""}
            </div>
          </Card>
          <Card className="p-4">
            <Eyebrow>estado</Eyebrow>
            <div className="mt-2">
              <Pill tone={piece.status === "en_piso" ? "ok" : "off"}>{piece.status.replaceAll("_", " ")}</Pill>
            </div>
          </Card>
          <Card className="p-4 col-span-2 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-[12px]">
            <div>
              <Eyebrow>categoría</Eyebrow>
              <div className="mt-1 capitalize">{piece.category}</div>
            </div>
            <div>
              <Eyebrow>material</Eyebrow>
              <div className="mt-1">{piece.material ?? "—"}</div>
            </div>
            <div>
              <Eyebrow>medidas</Eyebrow>
              <div className="mt-1">{piece.dimensions ?? "—"}</div>
            </div>
            <div>
              <Eyebrow>ubicación</Eyebrow>
              <div className="mt-1">{piece.location ?? "—"}</div>
            </div>
            <div>
              <Eyebrow>ingreso</Eyebrow>
              <div className="mt-1">{fmtDate(piece.entryDate)}</div>
            </div>
            <div>
              <Eyebrow>recibió</Eyebrow>
              <div className="mt-1">{piece.receivedBy ?? "—"}</div>
            </div>
            <div>
              <Eyebrow>% marca · piso</Eyebrow>
              <div className="mt-1 tabular-nums">
                {piece.brandPct} · {piece.pisoPct}
              </div>
            </div>
            <div>
              <Eyebrow>modelo</Eyebrow>
              <div className="mt-1 capitalize">
                {piece.isConsignment ? "consignación" : brand?.model ?? "—"}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card className="p-5">
          <Eyebrow>historial de movimientos</Eyebrow>
          {movements.length === 0 ? (
            <Empty>Sin movimientos.</Empty>
          ) : (
            <table className="w-full mt-3">
              <thead>
                <tr>
                  <TH>Fecha</TH>
                  <TH>Tipo</TH>
                  <TH>Δ</TH>
                  <TH>Usuario</TH>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id}>
                    <TD className="text-[11px]">{fmtDate(m.createdAt)} · {fmtTime(m.createdAt)}</TD>
                    <TD>{m.type.replaceAll("_", " ")}</TD>
                    <TD className="tabular-nums">{m.qty > 0 ? `+${m.qty}` : m.qty}</TD>
                    <TD>{m.userName}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card className="p-5">
          <Eyebrow>ventas asociadas</Eyebrow>
          {sales.length === 0 ? (
            <Empty>Sin ventas.</Empty>
          ) : (
            <table className="w-full mt-3">
              <thead>
                <tr>
                  <TH>Folio</TH>
                  <TH>Fecha</TH>
                  <TH>Cantidad</TH>
                  <TH className="text-right">Total línea</TH>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => {
                  const it = s.items.find((i) => i.pieceId === piece.id)!;
                  return (
                    <tr key={s.id}>
                      <TD className="font-medium">{s.folio}</TD>
                      <TD>{fmtDate(s.createdAt)}</TD>
                      <TD className="tabular-nums">{it.qty}</TD>
                      <TD className="text-right tabular-nums">{fmtMXN(it.lineTotal)}</TD>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}
