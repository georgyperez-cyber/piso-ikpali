"use client";

import { useMemo, useState } from "react";
import { fmtDate, fmtMXN, useStore } from "../_lib/store";
import { Button, Card, Empty, Eyebrow, Field, Input, Modal, PageHeader, Pill, Select, Stat, TD, TH, Textarea } from "../_components/UI";
import type { Brand, CommercialModel } from "../_lib/types";

const MODEL_LABEL: Record<CommercialModel, string> = {
  consignacion: "Consignación",
  compra_directa: "Compra directa",
  pieza_propia: "Pieza propia",
  colaboracion: "Colaboración",
};

export default function MarcasPage() {
  const { state, currentUser, upsertBrand } = useStore();
  const isAdmin = currentUser.role === "admin";
  const [editing, setEditing] = useState<Brand | null>(null);
  const [creating, setCreating] = useState(false);

  const rows = useMemo(() => {
    return state.brands.map((b) => {
      const pieces = state.pieces.filter((p) => p.brandId === b.id);
      const active = pieces.filter((p) => p.status === "en_piso");
      const sold = state.sales
        .filter((s) => s.status === "completada")
        .flatMap((s) => s.items)
        .filter((i) => i.brandId === b.id);
      const pendingLiq = state.liquidations
        .filter((l) => l.brandId === b.id && l.status === "pendiente")
        .reduce((t, l) => t + l.brandTotal, 0);
      return {
        brand: b,
        pieces: pieces.length,
        active: active.length,
        sold: sold.length,
        soldAmount: sold.reduce((t, i) => t + i.lineTotal, 0),
        pendingLiq,
      };
    });
  }, [state.brands, state.pieces, state.sales, state.liquidations]);

  const totals = {
    brands: state.brands.length,
    active: state.brands.filter((b) => b.status === "activa").length,
    consigned: state.pieces.filter((p) => p.isConsignment).length,
    pendingLiq: state.liquidations
      .filter((l) => l.status === "pendiente")
      .reduce((t, l) => t + l.brandTotal, 0),
  };

  return (
    <div>
      <PageHeader
        eyebrow="catálogo"
        title="Marcas"
        subtitle="Cada pieza pertenece a una marca, salvo pieza propia. Los porcentajes pueden ser distintos por marca."
        right={
          isAdmin ? <Button variant="primary" onClick={() => setCreating(true)}>nueva marca</Button> : null
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="marcas" value={totals.brands} sub={`${totals.active} activas`} />
        <Stat label="piezas en consignación" value={totals.consigned} />
        <Stat label="pendiente por liquidar" value={fmtMXN(totals.pendingLiq)} />
        <Stat label="modelo estándar" value="65 · 35" sub="marca · piso" />
      </div>

      <Card className="p-5">
        {rows.length === 0 ? (
          <Empty>Sin marcas registradas.</Empty>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <TH>Marca</TH>
                <TH>Contacto</TH>
                <TH>Modelo</TH>
                <TH>% marca · piso</TH>
                <TH>En piso</TH>
                <TH>Vendidas</TH>
                <TH>Pend. liquidar</TH>
                <TH>Estado</TH>
                <TH />
              </tr>
            </thead>
            <tbody>
              {rows.map(({ brand, active, sold, pendingLiq }) => (
                <tr key={brand.id} className="hover:bg-rojo/[0.02]">
                  <TD>
                    <div className="font-medium">{brand.name}</div>
                    <div className="text-[10px] tracking-[0.18em] uppercase text-rojo/50">
                      {brand.instagram ?? "—"}
                    </div>
                  </TD>
                  <TD>{brand.contact}</TD>
                  <TD className="capitalize">{MODEL_LABEL[brand.model]}</TD>
                  <TD className="tabular-nums">
                    {brand.brandPct} · {brand.pisoPct}
                  </TD>
                  <TD className="tabular-nums">{active}</TD>
                  <TD className="tabular-nums">{sold}</TD>
                  <TD className="tabular-nums">{pendingLiq > 0 ? fmtMXN(pendingLiq) : "—"}</TD>
                  <TD>
                    <Pill tone={brand.status === "activa" ? "ok" : "off"}>{brand.status}</Pill>
                  </TD>
                  <TD className="text-right">
                    <button
                      onClick={() => setEditing(brand)}
                      className="text-[10px] tracking-[0.2em] uppercase text-rojo/70 hover:text-rojo"
                    >
                      {isAdmin ? "editar →" : "ver →"}
                    </button>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {creating && (
        <BrandModal
          open
          onClose={() => setCreating(false)}
          onSave={(b) => {
            upsertBrand(b);
            setCreating(false);
          }}
          canEdit={isAdmin}
        />
      )}
      {editing && (
        <BrandModal
          key={editing.id}
          open
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(b) => {
            upsertBrand(b);
            setEditing(null);
          }}
          canEdit={isAdmin}
        />
      )}
    </div>
  );
}

function BrandModal({
  open,
  onClose,
  onSave,
  initial,
  canEdit,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (b: Brand) => void;
  initial?: Brand;
  canEdit: boolean;
}) {
  const isNew = !initial;
  const [name, setName] = useState(initial?.name ?? "");
  const [contact, setContact] = useState(initial?.contact ?? "");
  const [instagram, setInstagram] = useState(initial?.instagram ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [model, setModel] = useState<CommercialModel>(initial?.model ?? "consignacion");
  const [brandPct, setBrandPct] = useState<string>(String(initial?.brandPct ?? 65));
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const submit = () => {
    if (!canEdit) return;
    const bp = Math.min(100, Math.max(0, Number(brandPct) || 0));
    const b: Brand = {
      id: initial?.id ?? `b-${Date.now().toString(36)}`,
      name: name.trim(),
      contact: contact.trim(),
      phone: phone.trim() || undefined,
      instagram: instagram.trim() || undefined,
      brandPct: bp,
      pisoPct: 100 - bp,
      model,
      status: initial?.status ?? "activa",
      notes: notes.trim() || undefined,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    };
    if (!b.name || !b.contact) return;
    onSave(b);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? "Nueva marca" : `Editar · ${initial?.name}`}
      footer={
        canEdit ? (
          <>
            <Button variant="ghost" onClick={onClose}>cancelar</Button>
            <Button variant="primary" onClick={submit}>guardar</Button>
          </>
        ) : (
          <Button variant="ghost" onClick={onClose}>cerrar</Button>
        )
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="nombre">
          <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!canEdit} />
        </Field>
        <Field label="contacto principal">
          <Input value={contact} onChange={(e) => setContact(e.target.value)} disabled={!canEdit} />
        </Field>
        <Field label="instagram">
          <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} disabled={!canEdit} />
        </Field>
        <Field label="teléfono">
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!canEdit} />
        </Field>
        <Field label="modelo comercial">
          <Select value={model} onChange={(e) => setModel(e.target.value as CommercialModel)} disabled={!canEdit}>
            {Object.entries(MODEL_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </Field>
        <Field label="% marca" hint={`piso ikpali: ${100 - (Number(brandPct) || 0)}%`}>
          <Input
            type="number"
            min="0"
            max="100"
            value={brandPct}
            onChange={(e) => setBrandPct(e.target.value)}
            disabled={!canEdit}
          />
        </Field>
        <div className="col-span-2">
          <Field label="notas internas">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} disabled={!canEdit} />
          </Field>
        </div>
      </div>
      {initial ? (
        <div className="mt-5 pt-4 border-t border-rojo/10 text-[11px] text-rojo/60">
          Alta {fmtDate(initial.createdAt)} — los porcentajes nuevos no afectan ventas pasadas.
        </div>
      ) : null}
    </Modal>
  );
}
