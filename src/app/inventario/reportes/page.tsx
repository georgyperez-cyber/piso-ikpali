"use client";

import { useMemo, useState } from "react";
import { fmtDate, fmtMXN, fmtTime, useStore } from "../_lib/store";
import { Button, Card, Empty, Eyebrow, PageHeader, Pill, Stat, TD, TH } from "../_components/UI";

type Tab = "diario" | "inventario" | "marca" | "rotacion" | "caja";

export default function ReportesPage() {
  const { state } = useStore();
  const [tab, setTab] = useState<Tab>("diario");

  const csvDownload = (filename: string, rows: (string | number)[][]) => {
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        eyebrow="lectura"
        title="Reportes"
        subtitle="Visibilidad operativa, comercial y curatorial. Exportable como CSV."
        right={
          <div className="flex gap-1">
            {(["diario", "inventario", "marca", "rotacion", "caja"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`h-9 px-3 text-[10px] tracking-[0.2em] uppercase border ${
                  tab === t
                    ? "bg-rojo text-blanco border-rojo"
                    : "border-rojo/30 text-rojo/70 hover:bg-rojo/5"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        }
      />

      {tab === "diario" && <ReporteDiario state={state} csvDownload={csvDownload} />}
      {tab === "inventario" && <ReporteInventario state={state} csvDownload={csvDownload} />}
      {tab === "marca" && <ReporteMarca state={state} csvDownload={csvDownload} />}
      {tab === "rotacion" && <ReporteRotacion state={state} />}
      {tab === "caja" && <ReporteCaja state={state} csvDownload={csvDownload} />}
    </div>
  );
}

type S = ReturnType<typeof useStore>["state"];

function ReporteDiario({ state, csvDownload }: { state: S; csvDownload: (n: string, r: (string | number)[][]) => void }) {
  const today = new Date();
  const sameDay = (iso: string) => {
    const d = new Date(iso);
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  };
  const sales = state.sales.filter((s) => sameDay(s.createdAt));
  const completed = sales.filter((s) => s.status === "completada");
  const cash = completed.filter((s) => s.paymentMethod === "efectivo").reduce((t, s) => t + s.total, 0);
  const card = completed.filter((s) => s.paymentMethod === "tarjeta").reduce((t, s) => t + s.total, 0);
  const total = cash + card;
  const pieces = completed.reduce((t, s) => t + s.items.reduce((q, i) => q + i.qty, 0), 0);
  const cancelled = sales.filter((s) => s.status === "cancelada").length;

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["Folio", "Hora", "Usuario", "Método", "Piezas", "Total", "Estado"],
      ...sales.map((s) => [
        s.folio,
        fmtTime(s.createdAt),
        s.userName,
        s.paymentMethod,
        s.items.reduce((q, i) => q + i.qty, 0),
        s.total,
        s.status,
      ]),
    ];
    csvDownload(`piso-ikpali-diario-${today.toISOString().slice(0, 10)}.csv`, rows);
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <Stat label="total" value={fmtMXN(total)} />
        <Stat label="efectivo" value={fmtMXN(cash)} />
        <Stat label="tarjeta" value={fmtMXN(card)} />
        <Stat label="tickets" value={completed.length} />
        <Stat label="piezas" value={pieces} />
        <Stat label="canceladas" value={cancelled} />
      </div>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Eyebrow>operación del día</Eyebrow>
          <Button size="sm" onClick={exportCsv} disabled={sales.length === 0}>
            exportar csv
          </Button>
        </div>
        {sales.length === 0 ? (
          <Empty>Sin ventas hoy.</Empty>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <TH>Folio</TH>
                <TH>Hora</TH>
                <TH>Usuario</TH>
                <TH>Método</TH>
                <TH>Piezas</TH>
                <TH>Estado</TH>
                <TH className="text-right">Total</TH>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <TD className="font-medium">{s.folio}</TD>
                  <TD>{fmtTime(s.createdAt)}</TD>
                  <TD>{s.userName}</TD>
                  <TD className="capitalize">{s.paymentMethod}</TD>
                  <TD className="tabular-nums">{s.items.reduce((q, i) => q + i.qty, 0)}</TD>
                  <TD>
                    <Pill tone={s.status === "completada" ? "ok" : "off"}>{s.status}</Pill>
                  </TD>
                  <TD className="text-right tabular-nums font-medium">{fmtMXN(s.total)}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

function ReporteInventario({ state, csvDownload }: { state: S; csvDownload: (n: string, r: (string | number)[][]) => void }) {
  const rows = state.pieces.map((p) => {
    const brand = state.brands.find((b) => b.id === p.brandId);
    const moves = state.movements.filter((m) => m.pieceId === p.id);
    const sold = moves.filter((m) => m.type === "venta").reduce((t, m) => t - m.qty, 0);
    return {
      piece: p,
      brand,
      sold,
    };
  });
  const exportCsv = () => {
    const data: (string | number)[][] = [
      ["Pieza", "Marca", "Categoría", "Stock inicial", "Stock actual", "Vendidas", "Estado", "Ubicación", "Ingreso", "Precio"],
      ...rows.map((r) => [
        r.piece.name,
        r.brand?.name ?? "",
        r.piece.category,
        r.piece.initialStock,
        r.piece.currentStock,
        r.sold,
        r.piece.status,
        r.piece.location ?? "",
        fmtDate(r.piece.entryDate),
        r.piece.price,
      ]),
    ];
    csvDownload(`piso-ikpali-inventario-${new Date().toISOString().slice(0, 10)}.csv`, data);
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>inventario completo</Eyebrow>
        <Button size="sm" onClick={exportCsv}>exportar csv</Button>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <TH>Pieza</TH>
            <TH>Marca</TH>
            <TH>Stock</TH>
            <TH>Vendidas</TH>
            <TH>Estado</TH>
            <TH>Ingreso</TH>
            <TH className="text-right">Precio</TH>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.piece.id}>
              <TD className="font-medium">{r.piece.name}</TD>
              <TD>{r.brand?.name}</TD>
              <TD className="tabular-nums">{r.piece.currentStock}/{r.piece.initialStock}</TD>
              <TD className="tabular-nums">{r.sold}</TD>
              <TD><Pill tone={r.piece.status === "en_piso" ? "ok" : "off"}>{r.piece.status.replaceAll("_", " ")}</Pill></TD>
              <TD>{fmtDate(r.piece.entryDate)}</TD>
              <TD className="text-right tabular-nums">{fmtMXN(r.piece.price)}</TD>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function ReporteMarca({ state, csvDownload }: { state: S; csvDownload: (n: string, r: (string | number)[][]) => void }) {
  const rows = state.brands.map((b) => {
    const pieces = state.pieces.filter((p) => p.brandId === b.id);
    const items = state.sales
      .filter((s) => s.status === "completada")
      .flatMap((s) => s.items.map((i) => ({ ...i, saleDate: s.createdAt, folio: s.folio })))
      .filter((i) => i.brandId === b.id);
    return {
      brand: b,
      active: pieces.filter((p) => p.status === "en_piso").length,
      sold: items.length,
      total: items.reduce((t, i) => t + i.lineTotal, 0),
      brandTotal: items.reduce((t, i) => t + i.brandAmount, 0),
      pisoTotal: items.reduce((t, i) => t + i.pisoAmount, 0),
    };
  });
  const exportCsv = () => {
    const data: (string | number)[][] = [
      ["Marca", "Activas", "Vendidas", "Total vendido", "Monto marca", "Monto piso"],
      ...rows.map((r) => [r.brand.name, r.active, r.sold, r.total, r.brandTotal, r.pisoTotal]),
    ];
    csvDownload(`piso-ikpali-por-marca-${new Date().toISOString().slice(0, 10)}.csv`, data);
  };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>desempeño por marca</Eyebrow>
        <Button size="sm" onClick={exportCsv}>exportar csv</Button>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <TH>Marca</TH>
            <TH>En piso</TH>
            <TH>Vendidas</TH>
            <TH>Total vendido</TH>
            <TH>Monto marca</TH>
            <TH className="text-right">Monto piso</TH>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.brand.id}>
              <TD className="font-medium">{r.brand.name}</TD>
              <TD className="tabular-nums">{r.active}</TD>
              <TD className="tabular-nums">{r.sold}</TD>
              <TD className="tabular-nums">{fmtMXN(r.total)}</TD>
              <TD className="tabular-nums">{fmtMXN(r.brandTotal)}</TD>
              <TD className="text-right tabular-nums">{fmtMXN(r.pisoTotal)}</TD>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function ReporteRotacion({ state }: { state: S }) {
  const now = Date.now();
  const inPiso = state.pieces.filter((p) => p.status === "en_piso");
  const noMov = inPiso.filter((p) => {
    const moves = state.movements.filter((m) => m.pieceId === p.id && m.type === "venta");
    return moves.length === 0;
  });
  const oldest = [...inPiso]
    .sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime())
    .slice(0, 10);

  const bestSellers = state.pieces
    .map((p) => {
      const sold = state.sales
        .filter((s) => s.status === "completada")
        .flatMap((s) => s.items)
        .filter((i) => i.pieceId === p.id)
        .reduce((t, i) => t + i.qty, 0);
      return { piece: p, sold };
    })
    .filter((x) => x.sold > 0)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <Card className="p-5">
        <Eyebrow>piezas sin venta</Eyebrow>
        {noMov.length === 0 ? (
          <div className="mt-3"><Empty>Todas las piezas en piso tienen al menos una venta.</Empty></div>
        ) : (
          <ul className="mt-3 divide-y divide-rojo/10">
            {noMov.map((p) => (
              <li key={p.id} className="py-2 flex items-center justify-between text-[13px]">
                <span className="font-medium">{p.name}</span>
                <span className="text-rojo/60 text-[11px]">{Math.floor((now - new Date(p.entryDate).getTime()) / 86400000)} días</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <Eyebrow>piezas con más tiempo en piso</Eyebrow>
        <ul className="mt-3 divide-y divide-rojo/10">
          {oldest.map((p) => (
            <li key={p.id} className="py-2 flex items-center justify-between text-[13px]">
              <span className="font-medium">{p.name}</span>
              <span className="text-rojo/60 text-[11px]">{Math.floor((now - new Date(p.entryDate).getTime()) / 86400000)} días</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5 lg:col-span-2">
        <Eyebrow>mejores piezas (por unidades)</Eyebrow>
        {bestSellers.length === 0 ? (
          <div className="mt-3"><Empty>Aún sin ventas suficientes.</Empty></div>
        ) : (
          <table className="w-full mt-3">
            <thead>
              <tr>
                <TH>Pieza</TH>
                <TH>Marca</TH>
                <TH>Categoría</TH>
                <TH className="text-right">Unidades vendidas</TH>
              </tr>
            </thead>
            <tbody>
              {bestSellers.map((b) => {
                const brand = state.brands.find((x) => x.id === b.piece.brandId);
                return (
                  <tr key={b.piece.id}>
                    <TD className="font-medium">{b.piece.name}</TD>
                    <TD>{brand?.name}</TD>
                    <TD className="capitalize">{b.piece.category}</TD>
                    <TD className="text-right tabular-nums font-medium">{b.sold}</TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

function ReporteCaja({ state, csvDownload }: { state: S; csvDownload: (n: string, r: (string | number)[][]) => void }) {
  const shifts = state.shifts;
  const exportCsv = () => {
    const data: (string | number)[][] = [
      ["Apertura", "Cierre", "Abrió", "Cerró", "Fondo", "Contado", "Estado"],
      ...shifts.map((sh) => [
        fmtDate(sh.openedAt),
        sh.closedAt ? fmtDate(sh.closedAt) : "",
        sh.openedByName,
        sh.closedByName ?? "",
        sh.openingCash,
        sh.countedCash ?? "",
        sh.status,
      ]),
    ];
    csvDownload(`piso-ikpali-caja-${new Date().toISOString().slice(0, 10)}.csv`, data);
  };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>cortes</Eyebrow>
        <Button size="sm" onClick={exportCsv}>exportar csv</Button>
      </div>
      {shifts.length === 0 ? (
        <Empty>Sin cortes.</Empty>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <TH>Apertura</TH>
              <TH>Cierre</TH>
              <TH>Abrió</TH>
              <TH>Cerró</TH>
              <TH>Fondo</TH>
              <TH>Contado</TH>
              <TH>Estado</TH>
            </tr>
          </thead>
          <tbody>
            {shifts.map((sh) => (
              <tr key={sh.id}>
                <TD>{fmtDate(sh.openedAt)} · {fmtTime(sh.openedAt)}</TD>
                <TD>{sh.closedAt ? `${fmtDate(sh.closedAt)} · ${fmtTime(sh.closedAt)}` : "—"}</TD>
                <TD>{sh.openedByName}</TD>
                <TD>{sh.closedByName ?? "—"}</TD>
                <TD className="tabular-nums">{fmtMXN(sh.openingCash)}</TD>
                <TD className="tabular-nums">{sh.countedCash != null ? fmtMXN(sh.countedCash) : "—"}</TD>
                <TD><Pill tone={sh.status === "abierta" ? "ok" : "off"}>{sh.status}</Pill></TD>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
