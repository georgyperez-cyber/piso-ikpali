"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { fmtDate, fmtMXN, useStore } from "../_lib/store";
import { Card, Empty, Eyebrow, Input, PageHeader, Pill, Select, Stat, TD, TH } from "../_components/UI";
import PieceImage from "../_components/PieceImage";
import type { PieceStatus } from "../_lib/types";

const STATUS_LABEL: Record<PieceStatus, string> = {
  en_piso: "en piso",
  vendida: "vendida",
  reservada: "reservada",
  devuelta_a_marca: "devuelta",
  danada: "dañada",
  prestada: "prestada",
  retirada: "retirada",
  en_revision: "en revisión",
};

export default function PiezasPage() {
  const { state } = useStore();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<PieceStatus | "">("");

  const items = useMemo(() => {
    return state.pieces.filter((p) => {
      if (brandFilter && p.brandId !== brandFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        const brand = state.brands.find((b) => b.id === p.brandId);
        return (
          p.name.toLowerCase().includes(q) ||
          brand?.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.location ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [state.pieces, state.brands, query, brandFilter, statusFilter]);

  const totals = useMemo(() => {
    const en = state.pieces.filter((p) => p.status === "en_piso");
    return {
      en: en.length,
      stock: en.reduce((t, p) => t + p.currentStock, 0),
      reserved: state.pieces.filter((p) => p.status === "reservada").length,
      sold: state.pieces.filter((p) => p.status === "vendida").length,
      damaged: state.pieces.filter((p) => p.status === "danada").length,
    };
  }, [state.pieces]);

  return (
    <div>
      <PageHeader
        eyebrow="catálogo"
        title="Piezas"
        subtitle="Todas las piezas registradas: en piso, vendidas, reservadas, devueltas y retiradas."
        right={
          <div className="flex gap-1">
            <button
              onClick={() => setView("grid")}
              className={`h-9 px-3 text-[10px] tracking-[0.2em] uppercase border ${
                view === "grid"
                  ? "bg-rojo text-blanco border-rojo"
                  : "border-rojo/30 text-rojo/70 hover:bg-rojo/5"
              }`}
            >
              cuadrícula
            </button>
            <button
              onClick={() => setView("list")}
              className={`h-9 px-3 text-[10px] tracking-[0.2em] uppercase border ${
                view === "list"
                  ? "bg-rojo text-blanco border-rojo"
                  : "border-rojo/30 text-rojo/70 hover:bg-rojo/5"
              }`}
            >
              tabla
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <Stat label="en piso" value={totals.en} sub={`${totals.stock} unidades`} />
        <Stat label="reservadas" value={totals.reserved} />
        <Stat label="vendidas" value={totals.sold} />
        <Stat label="dañadas" value={totals.damaged} />
        <Stat label="total registrado" value={state.pieces.length} />
      </div>

      <Card className="p-4 mb-4 flex flex-col md:flex-row gap-3">
        <Input
          placeholder="Buscar por nombre, marca, categoría, ubicación…"
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PieceStatus | "")}
          className="md:w-[200px]"
        >
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
      </Card>

      {items.length === 0 ? (
        <Empty>Sin piezas con esos filtros.</Empty>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {items.map((p) => {
            const brand = state.brands.find((b) => b.id === p.brandId);
            return (
              <Link
                href={`/inventario/piezas/${p.id}`}
                key={p.id}
                className="group bg-blanco border border-rojo/15 hover:border-rojo transition-colors"
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
                        {brand?.name} · {p.category}
                      </div>
                    </div>
                    <div className="text-rojo font-medium text-[13px] tabular-nums shrink-0">
                      {fmtMXN(p.price)}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <Pill tone={p.status === "en_piso" ? "ok" : p.status === "danada" ? "warn" : "off"}>
                      {STATUS_LABEL[p.status]}
                    </Pill>
                    {p.isUnique && <Pill tone="rojo">única</Pill>}
                    {!p.isUnique && <Pill tone="off">stock {p.currentStock}</Pill>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="p-5">
          <table className="w-full">
            <thead>
              <tr>
                <TH>Pieza</TH>
                <TH>Marca</TH>
                <TH>Categoría</TH>
                <TH>Stock</TH>
                <TH>Estado</TH>
                <TH>Ubicación</TH>
                <TH>Ingreso</TH>
                <TH className="text-right">Precio</TH>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => {
                const brand = state.brands.find((b) => b.id === p.brandId);
                return (
                  <tr key={p.id} className="hover:bg-rojo/[0.02]">
                    <TD>
                      <Link
                        href={`/inventario/piezas/${p.id}`}
                        className="font-medium hover:underline"
                      >
                        {p.name}
                      </Link>
                    </TD>
                    <TD>{brand?.name}</TD>
                    <TD className="capitalize">{p.category}</TD>
                    <TD className="tabular-nums">
                      {p.isUnique ? "única" : p.currentStock}
                    </TD>
                    <TD>
                      <Pill tone={p.status === "en_piso" ? "ok" : "off"}>
                        {STATUS_LABEL[p.status]}
                      </Pill>
                    </TD>
                    <TD>{p.location ?? "—"}</TD>
                    <TD>{fmtDate(p.entryDate)}</TD>
                    <TD className="text-right tabular-nums font-medium">{fmtMXN(p.price)}</TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
