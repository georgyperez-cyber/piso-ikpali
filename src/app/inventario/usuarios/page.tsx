"use client";

import { useStore, roleLabel } from "../_lib/store";
import { Card, Empty, Eyebrow, PageHeader, Pill, TD, TH } from "../_components/UI";

const ROLE_PERMISSIONS = [
  ["Registrar venta", true, true, true],
  ["Ver ventas del día", true, true, true],
  ["Cancelar venta", false, true, true],
  ["Crear pieza", false, "limitado", true],
  ["Editar pieza · precio", false, false, true],
  ["Crear/editar marca", false, false, true],
  ["Registrar entrada", "opcional", true, true],
  ["Registrar salida", "limitado", true, true],
  ["Registrar daño · préstamo", true, true, true],
  ["Hacer corte de caja", true, true, true],
  ["Ver reportes completos", false, "parcial", true],
  ["Marcar liquidación pagada", false, false, true],
  ["Exportar datos", false, "parcial", true],
  ["Crear usuarios", false, false, true],
] as const;

export default function UsuariosPage() {
  const { state, currentUser } = useStore();
  const canSee = currentUser.role === "admin";

  if (!canSee) {
    return (
      <div>
        <PageHeader eyebrow="acceso restringido" title="Usuarios" />
        <Empty>Solo administradores pueden ver esta sección.</Empty>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="acceso · permisos"
        title="Usuarios"
        subtitle="Cada movimiento queda asociado a un usuario. Los roles controlan qué se puede hacer."
      />

      <Card className="p-5 mb-6">
        <Eyebrow>usuarios registrados</Eyebrow>
        {state.users.length === 0 ? (
          <Empty>Sin usuarios.</Empty>
        ) : (
          <table className="w-full mt-3">
            <thead>
              <tr>
                <TH>Nombre</TH>
                <TH>Rol</TH>
                <TH>Estado</TH>
                <TH>ID</TH>
              </tr>
            </thead>
            <tbody>
              {state.users.map((u) => (
                <tr key={u.id}>
                  <TD className="font-medium">{u.name}</TD>
                  <TD>{roleLabel(u.role)}</TD>
                  <TD>
                    <Pill tone={u.active ? "ok" : "off"}>{u.active ? "activo" : "inactivo"}</Pill>
                  </TD>
                  <TD className="text-rojo/50 text-[11px] tracking-[0.1em]">{u.id}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card className="p-5">
        <Eyebrow>matriz de permisos</Eyebrow>
        <table className="w-full mt-3">
          <thead>
            <tr>
              <TH>Acción</TH>
              <TH className="text-center">Empleado</TH>
              <TH className="text-center">Manager</TH>
              <TH className="text-center">Admin</TH>
            </tr>
          </thead>
          <tbody>
            {ROLE_PERMISSIONS.map((row) => (
              <tr key={row[0] as string}>
                <TD>{row[0] as string}</TD>
                {([row[1], row[2], row[3]] as (boolean | string)[]).map((v, i) => (
                  <TD key={i} className="text-center">
                    {v === true ? (
                      <span className="text-rojo font-medium">sí</span>
                    ) : v === false ? (
                      <span className="text-rojo/30">—</span>
                    ) : (
                      <span className="text-[11px] text-rojo/70">{v}</span>
                    )}
                  </TD>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-6 text-[11px] text-rojo/60 font-light max-w-[60ch]">
        Esta versión de demo usa selección de usuario sin contraseña. En producción cada usuario tendría correo + PIN y los movimientos sensibles requerirían PIN de admin.
      </div>
    </div>
  );
}
