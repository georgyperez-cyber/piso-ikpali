"use client";

import { Fragment, useMemo, useState } from "react";
import { fmtDate, fmtMXN, useStore } from "../_lib/store";
import { Button, Card, Empty, Eyebrow, PageHeader, Pill, Select, Stat, TD, TH } from "../_components/UI";

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function LiquidacionesPage() {
  const { state, currentUser, generateLiquidations, markLiquidationPaid } = useStore();
  const isAdmin = currentUser.role === "admin";

  const [period, setPeriod] = useState<string>(currentMonth());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Precompute possible periods: current month + last 11
  const periods = useMemo(() => {
    const d = new Date();
    const arr: string[] = [];
    for (let i = 0; i < 12; i++) {
      const y = d.getFullYear();
      const m = d.getMonth() - i;
      const date = new Date(y, m, 1);
      arr.push(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      );
    }
    return arr;
  }, []);

  const liqs = state.liquidations
    .filter((l) => l.periodLabel === period)
    .sort((a, b) => b.totalSales - a.totalSales);

  const totals = useMemo(() => {
    const total = liqs.reduce((t, l) => t + l.totalSales, 0);
    const brand = liqs.reduce((t, l) => t + l.brandTotal, 0);
    const piso = liqs.reduce((t, l) => t + l.pisoTotal, 0);
    const pendiente = liqs.filter((l) => l.status === "pendiente").reduce((t, l) => t + l.brandTotal, 0);
    return { total, brand, piso, pendiente };
  }, [liqs]);

  return (
    <div>
      <PageHeader
        eyebrow="cierre comercial · mensual"
        title="Liquidaciones"
        subtitle="Calcula automáticamente lo que se debe a cada marca por periodo. Modelo estándar 65/35, personalizable por marca."
        right={
          isAdmin ? (
            <Button variant="primary" onClick={() => generateLiquidations(period)}>
              recalcular {period}
            </Button>
          ) : null
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 mb-6 items-stretch">
        <Card className="p-4">
          <Eyebrow>periodo</Eyebrow>
          <Select className="mt-2" value={period} onChange={(e) => setPeriod(e.target.value)}>
            {periods.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
        </Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="vendido total" value={fmtMXN(totals.total)} />
          <Stat label="para marcas" value={fmtMXN(totals.brand)} />
          <Stat label="piso ikpali" value={fmtMXN(totals.piso)} />
          <Stat label="pendiente por pagar" value={fmtMXN(totals.pendiente)} sub={`${liqs.filter((l) => l.status === "pendiente").length} marcas`} />
        </div>
      </div>

      <Card className="p-5">
        <Eyebrow>marcas en este periodo</Eyebrow>
        {liqs.length === 0 ? (
          <div className="mt-4">
            <Empty>
              Aún no hay liquidaciones calculadas para {period}. Genera el reporte con &ldquo;recalcular {period}&rdquo;.
            </Empty>
          </div>
        ) : (
          <table className="w-full mt-3">
            <thead>
              <tr>
                <TH>Marca</TH>
                <TH>Piezas vendidas</TH>
                <TH>Total vendido</TH>
                <TH>% marca · piso</TH>
                <TH>Monto marca</TH>
                <TH>Monto piso</TH>
                <TH>Estado</TH>
                <TH />
              </tr>
            </thead>
            <tbody>
              {liqs.map((l) => {
                const refs = l.saleItemRefs;
                const items = refs
                  .map((r) => {
                    const sale = state.sales.find((s) => s.id === r.saleId);
                    if (!sale) return null;
                    return { sale, item: sale.items[r.itemIdx] };
                  })
                  .filter((x): x is { sale: NonNullable<typeof x>["sale"]; item: NonNullable<typeof x>["item"] } => !!x);

                const pieces = items.reduce((t, x) => t + x.item.qty, 0);
                const brand = state.brands.find((b) => b.id === l.brandId);

                return (
                  <Fragment key={l.id}>
                    <tr className="hover:bg-rojo/[0.02]">
                      <TD className="font-medium">{l.brandName}</TD>
                      <TD className="tabular-nums">{pieces}</TD>
                      <TD className="tabular-nums">{fmtMXN(l.totalSales)}</TD>
                      <TD className="tabular-nums">
                        {brand ? `${brand.brandPct} · ${brand.pisoPct}` : "—"}
                      </TD>
                      <TD className="tabular-nums font-medium">{fmtMXN(l.brandTotal)}</TD>
                      <TD className="tabular-nums">{fmtMXN(l.pisoTotal)}</TD>
                      <TD>
                        <Pill tone={l.status === "pagada" ? "ok" : "warn"}>
                          {l.status}
                          {l.paidAt ? ` · ${fmtDate(l.paidAt)}` : ""}
                        </Pill>
                      </TD>
                      <TD className="text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setExpandedId(expandedId === l.id ? null : l.id)}
                            className="text-[10px] tracking-[0.2em] uppercase text-rojo/70 hover:text-rojo"
                          >
                            {expandedId === l.id ? "ocultar" : "ver"}
                          </button>
                          {isAdmin && l.status === "pendiente" && (
                            <button
                              onClick={() => markLiquidationPaid(l.id)}
                              className="text-[10px] tracking-[0.2em] uppercase text-rojo hover:underline"
                            >
                              marcar pagada
                            </button>
                          )}
                        </div>
                      </TD>
                    </tr>
                    {expandedId === l.id && (
                      <tr>
                        <td colSpan={8} className="bg-rojo/[0.03] px-3 py-4 border-b border-rojo/10 align-top">
                          <table className="w-full">
                            <thead>
                              <tr>
                                <TH>Folio</TH>
                                <TH>Fecha</TH>
                                <TH>Pieza</TH>
                                <TH>Cantidad</TH>
                                <TH>Precio</TH>
                                <TH className="text-right">Monto marca</TH>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((x, idx) => (
                                <tr key={`${x.sale.id}-${idx}`}>
                                  <TD>{x.sale.folio}</TD>
                                  <TD>{fmtDate(x.sale.createdAt)}</TD>
                                  <TD>{x.item.pieceName}</TD>
                                  <TD className="tabular-nums">{x.item.qty}</TD>
                                  <TD className="tabular-nums">{fmtMXN(x.item.unitPrice)}</TD>
                                  <TD className="text-right tabular-nums font-medium">
                                    {fmtMXN(x.item.brandAmount)}
                                  </TD>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <div className="mt-6 text-[11px] text-rojo/60 font-light max-w-[60ch]">
        Una liquidación pagada queda bloqueada. Si hay un error, debe crearse un ajuste — no se sobreescribe el registro.
      </div>
    </div>
  );
}
