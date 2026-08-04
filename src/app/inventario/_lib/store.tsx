"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  seedBrands,
  seedLiquidations,
  seedMovements,
  seedPieces,
  seedReservations,
  seedSales,
  seedShifts,
  seedUsers,
} from "./mockData";
import type {
  Brand,
  CashMovement,
  CashShift,
  InventoryMovement,
  Liquidation,
  MovementType,
  PaymentMethod,
  Piece,
  Reservation,
  Role,
  Sale,
  SaleItem,
  User,
} from "./types";

const KEY = "pi-inventory-v1";

type State = {
  users: User[];
  brands: Brand[];
  pieces: Piece[];
  sales: Sale[];
  movements: InventoryMovement[];
  reservations: Reservation[];
  shifts: CashShift[];
  cashMovements: CashMovement[];
  liquidations: Liquidation[];
  currentUserId: string;
};

const seed = (): State => ({
  users: seedUsers,
  brands: seedBrands,
  pieces: seedPieces,
  sales: seedSales,
  movements: seedMovements,
  reservations: seedReservations,
  shifts: seedShifts,
  cashMovements: [],
  liquidations: seedLiquidations,
  currentUserId: "u1",
});

type Ctx = {
  state: State;
  currentUser: User;
  setRoleAs: (userId: string) => void;
  resetAll: () => void;

  // brands
  upsertBrand: (b: Brand) => void;

  // pieces
  upsertPiece: (p: Piece) => void;

  // sales
  createSale: (input: {
    cart: { piece: Piece; qty: number }[];
    paymentMethod: PaymentMethod;
    cashReceived?: number;
  }) => Sale;
  cancelSale: (saleId: string, reason: string) => void;

  // inventory ops
  recordEntry: (input: {
    pieceId: string;
    qty: number;
    reason: string;
    note?: string;
    location?: string;
  }) => void;
  recordExit: (input: {
    pieceId: string;
    qty: number;
    type: MovementType;
    reason: string;
    note?: string;
  }) => void;

  // reservas
  createReservation: (input: Omit<Reservation, "id" | "status" | "reservedAt">) => void;
  cancelReservation: (id: string) => void;
  convertReservationToSale: (id: string, paymentMethod: PaymentMethod, cashReceived?: number) => void;

  // caja
  openShift: (openingCash: number) => void;
  closeShift: (countedCash: number, notes?: string) => void;
  addCashMovement: (m: Omit<CashMovement, "id" | "createdAt" | "userId" | "userName" | "shiftId">) => void;

  // liquidaciones
  generateLiquidations: (periodLabel: string) => Liquidation[];
  markLiquidationPaid: (id: string) => void;
};

const StoreContext = createContext<Ctx | null>(null);

let folioCounter = 145;
const nextFolio = () => `PI-${String(folioCounter++).padStart(6, "0")}`;

const uid = (prefix = "id") =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(() => seed());
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        setState(parsed);
        // recover folio counter from existing sales
        const maxFolio = parsed.sales.reduce((acc, s) => {
          const n = parseInt(s.folio.replace(/\D/g, ""), 10) || 0;
          return Math.max(acc, n);
        }, 0);
        folioCounter = maxFolio + 1;
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? state.users[0],
    [state.users, state.currentUserId]
  );

  const setRoleAs = useCallback((userId: string) => {
    setState((s) => ({ ...s, currentUserId: userId }));
  }, []);

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {}
    folioCounter = 145;
    setState(seed());
  }, []);

  // ───────── Brands
  const upsertBrand = useCallback((b: Brand) => {
    setState((s) => {
      const exists = s.brands.some((x) => x.id === b.id);
      return {
        ...s,
        brands: exists ? s.brands.map((x) => (x.id === b.id ? b : x)) : [...s.brands, b],
      };
    });
  }, []);

  // ───────── Pieces
  const upsertPiece = useCallback((p: Piece) => {
    setState((s) => {
      const exists = s.pieces.some((x) => x.id === p.id);
      return {
        ...s,
        pieces: exists ? s.pieces.map((x) => (x.id === p.id ? p : x)) : [...s.pieces, p],
      };
    });
  }, []);

  // ───────── Sales
  const createSale = useCallback(
    (input: {
      cart: { piece: Piece; qty: number }[];
      paymentMethod: PaymentMethod;
      cashReceived?: number;
    }): Sale => {
      let createdSale!: Sale;
      setState((s) => {
        const user = s.users.find((u) => u.id === s.currentUserId)!;
        const shift = s.shifts.find((sh) => sh.status === "abierta");

        const items: SaleItem[] = input.cart.map(({ piece, qty }) => {
          const lineTotal = piece.price * qty;
          const brand = s.brands.find((b) => b.id === piece.brandId)!;
          return {
            pieceId: piece.id,
            pieceName: piece.name,
            brandId: brand.id,
            brandName: brand.name,
            qty,
            unitPrice: piece.price,
            brandPct: piece.brandPct,
            pisoPct: piece.pisoPct,
            brandAmount: Math.round((lineTotal * piece.brandPct) / 100),
            pisoAmount: Math.round((lineTotal * piece.pisoPct) / 100),
            lineTotal,
          };
        });

        const total = items.reduce((t, i) => t + i.lineTotal, 0);

        const sale: Sale = {
          id: uid("sale"),
          folio: nextFolio(),
          userId: user.id,
          userName: user.name,
          shiftId: shift?.id,
          items,
          total,
          paymentMethod: input.paymentMethod,
          cashReceived: input.paymentMethod === "efectivo" ? input.cashReceived : undefined,
          change:
            input.paymentMethod === "efectivo" && input.cashReceived
              ? input.cashReceived - total
              : undefined,
          status: "completada",
          createdAt: new Date().toISOString(),
        };
        createdSale = sale;

        // update pieces stock + movements
        const pieces = s.pieces.map((pc) => {
          const it = items.find((i) => i.pieceId === pc.id);
          if (!it) return pc;
          const newStock = pc.currentStock - it.qty;
          return {
            ...pc,
            currentStock: newStock,
            status: newStock === 0 && pc.isUnique ? ("vendida" as const) : pc.status,
          };
        });

        const movements: InventoryMovement[] = [
          ...s.movements,
          ...items.map<InventoryMovement>((it) => {
            const pc = s.pieces.find((p) => p.id === it.pieceId)!;
            return {
              id: uid("mv"),
              pieceId: it.pieceId,
              pieceName: it.pieceName,
              brandId: it.brandId,
              type: "venta",
              qty: -it.qty,
              stockBefore: pc.currentStock,
              stockAfter: pc.currentStock - it.qty,
              userId: user.id,
              userName: user.name,
              createdAt: sale.createdAt,
              note: `Venta ${sale.folio}`,
            };
          }),
        ];

        return {
          ...s,
          sales: [sale, ...s.sales],
          pieces,
          movements,
        };
      });
      return createdSale;
    },
    []
  );

  const cancelSale = useCallback((saleId: string, reason: string) => {
    setState((s) => {
      const sale = s.sales.find((x) => x.id === saleId);
      if (!sale || sale.status !== "completada") return s;
      const user = s.users.find((u) => u.id === s.currentUserId)!;

      const pieces = s.pieces.map((pc) => {
        const it = sale.items.find((i) => i.pieceId === pc.id);
        if (!it) return pc;
        const newStock = pc.currentStock + it.qty;
        return {
          ...pc,
          currentStock: newStock,
          status: pc.status === "vendida" ? ("en_piso" as const) : pc.status,
        };
      });

      const movements: InventoryMovement[] = [
        ...s.movements,
        ...sale.items.map<InventoryMovement>((it) => {
          const pc = s.pieces.find((p) => p.id === it.pieceId)!;
          return {
            id: uid("mv"),
            pieceId: it.pieceId,
            pieceName: it.pieceName,
            brandId: it.brandId,
            type: "venta_cancelada",
            qty: it.qty,
            stockBefore: pc.currentStock,
            stockAfter: pc.currentStock + it.qty,
            userId: user.id,
            userName: user.name,
            createdAt: new Date().toISOString(),
            note: `Cancelación ${sale.folio}: ${reason}`,
          };
        }),
      ];

      return {
        ...s,
        pieces,
        movements,
        sales: s.sales.map((x) =>
          x.id === saleId
            ? {
                ...x,
                status: "cancelada",
                cancelledAt: new Date().toISOString(),
                cancelReason: reason,
              }
            : x
        ),
      };
    });
  }, []);

  // ───────── Inventory entries / exits
  const recordEntry = useCallback(
    (input: { pieceId: string; qty: number; reason: string; note?: string; location?: string }) => {
      setState((s) => {
        const user = s.users.find((u) => u.id === s.currentUserId)!;
        const piece = s.pieces.find((p) => p.id === input.pieceId);
        if (!piece) return s;

        const pieces = s.pieces.map((p) =>
          p.id === input.pieceId
            ? {
                ...p,
                currentStock: p.currentStock + input.qty,
                location: input.location ?? p.location,
                status:
                  p.status === "vendida" && p.currentStock + input.qty > 0
                    ? ("en_piso" as const)
                    : p.status,
              }
            : p
        );

        const movement: InventoryMovement = {
          id: uid("mv"),
          pieceId: piece.id,
          pieceName: piece.name,
          brandId: piece.brandId,
          type: "entrada",
          reason: input.reason,
          qty: input.qty,
          stockBefore: piece.currentStock,
          stockAfter: piece.currentStock + input.qty,
          userId: user.id,
          userName: user.name,
          note: input.note,
          createdAt: new Date().toISOString(),
        };

        return { ...s, pieces, movements: [movement, ...s.movements] };
      });
    },
    []
  );

  const recordExit = useCallback(
    (input: { pieceId: string; qty: number; type: MovementType; reason: string; note?: string }) => {
      setState((s) => {
        const user = s.users.find((u) => u.id === s.currentUserId)!;
        const piece = s.pieces.find((p) => p.id === input.pieceId);
        if (!piece) return s;

        const newStock = Math.max(0, piece.currentStock - input.qty);

        const newStatus = (() => {
          switch (input.type) {
            case "danada":
              return "danada" as const;
            case "prestada":
              return "prestada" as const;
            case "devolucion_a_marca":
              return "devuelta_a_marca" as const;
            case "rotacion_curatorial":
              return "retirada" as const;
            default:
              return piece.status;
          }
        })();

        const pieces = s.pieces.map((p) =>
          p.id === input.pieceId ? { ...p, currentStock: newStock, status: newStatus } : p
        );

        const movement: InventoryMovement = {
          id: uid("mv"),
          pieceId: piece.id,
          pieceName: piece.name,
          brandId: piece.brandId,
          type: input.type,
          reason: input.reason,
          qty: -input.qty,
          stockBefore: piece.currentStock,
          stockAfter: newStock,
          userId: user.id,
          userName: user.name,
          note: input.note,
          createdAt: new Date().toISOString(),
        };

        return { ...s, pieces, movements: [movement, ...s.movements] };
      });
    },
    []
  );

  // ───────── Reservations
  const createReservation = useCallback(
    (input: Omit<Reservation, "id" | "status" | "reservedAt">) => {
      setState((s) => {
        const reservation: Reservation = {
          ...input,
          id: uid("res"),
          reservedAt: new Date().toISOString(),
          status: "activa",
        };
        const pieces = s.pieces.map((p) =>
          p.id === input.pieceId && p.isUnique ? { ...p, status: "reservada" as const } : p
        );
        return { ...s, reservations: [reservation, ...s.reservations], pieces };
      });
    },
    []
  );

  const cancelReservation = useCallback((id: string) => {
    setState((s) => {
      const res = s.reservations.find((r) => r.id === id);
      if (!res) return s;
      const pieces = s.pieces.map((p) =>
        p.id === res.pieceId && p.status === "reservada" ? { ...p, status: "en_piso" as const } : p
      );
      return {
        ...s,
        pieces,
        reservations: s.reservations.map((r) =>
          r.id === id ? { ...r, status: "cancelada" as const } : r
        ),
      };
    });
  }, []);

  const convertReservationToSale = useCallback(
    (id: string, paymentMethod: PaymentMethod, cashReceived?: number) => {
      setState((s) => {
        const res = s.reservations.find((r) => r.id === id);
        if (!res || res.status !== "activa") return s;
        const piece = s.pieces.find((p) => p.id === res.pieceId);
        if (!piece) return s;
        const user = s.users.find((u) => u.id === s.currentUserId)!;
        const shift = s.shifts.find((sh) => sh.status === "abierta");
        const brand = s.brands.find((b) => b.id === piece.brandId)!;
        const lineTotal = piece.price * res.qty;

        const sale: Sale = {
          id: uid("sale"),
          folio: nextFolio(),
          userId: user.id,
          userName: user.name,
          shiftId: shift?.id,
          items: [
            {
              pieceId: piece.id,
              pieceName: piece.name,
              brandId: brand.id,
              brandName: brand.name,
              qty: res.qty,
              unitPrice: piece.price,
              brandPct: piece.brandPct,
              pisoPct: piece.pisoPct,
              brandAmount: Math.round((lineTotal * piece.brandPct) / 100),
              pisoAmount: Math.round((lineTotal * piece.pisoPct) / 100),
              lineTotal,
            },
          ],
          total: lineTotal,
          paymentMethod,
          cashReceived: paymentMethod === "efectivo" ? cashReceived : undefined,
          change:
            paymentMethod === "efectivo" && cashReceived ? cashReceived - lineTotal : undefined,
          status: "completada",
          createdAt: new Date().toISOString(),
        };

        const newStock = Math.max(0, piece.currentStock - res.qty);
        const pieces = s.pieces.map((p) =>
          p.id === piece.id
            ? {
                ...p,
                currentStock: newStock,
                status: newStock === 0 && p.isUnique ? ("vendida" as const) : ("en_piso" as const),
              }
            : p
        );

        const movement: InventoryMovement = {
          id: uid("mv"),
          pieceId: piece.id,
          pieceName: piece.name,
          brandId: piece.brandId,
          type: "venta",
          qty: -res.qty,
          stockBefore: piece.currentStock,
          stockAfter: newStock,
          userId: user.id,
          userName: user.name,
          createdAt: sale.createdAt,
          note: `Reserva → Venta ${sale.folio}`,
        };

        return {
          ...s,
          sales: [sale, ...s.sales],
          pieces,
          movements: [movement, ...s.movements],
          reservations: s.reservations.map((r) =>
            r.id === id ? { ...r, status: "convertida" as const, convertedSaleId: sale.id } : r
          ),
        };
      });
    },
    []
  );

  // ───────── Cash shift
  const openShift = useCallback((openingCash: number) => {
    setState((s) => {
      if (s.shifts.some((sh) => sh.status === "abierta")) return s;
      const user = s.users.find((u) => u.id === s.currentUserId)!;
      const shift: CashShift = {
        id: uid("sh"),
        openedBy: user.id,
        openedByName: user.name,
        openedAt: new Date().toISOString(),
        openingCash,
        status: "abierta",
      };
      return { ...s, shifts: [shift, ...s.shifts] };
    });
  }, []);

  const closeShift = useCallback((countedCash: number, notes?: string) => {
    setState((s) => {
      const user = s.users.find((u) => u.id === s.currentUserId)!;
      return {
        ...s,
        shifts: s.shifts.map((sh) =>
          sh.status === "abierta"
            ? {
                ...sh,
                status: "cerrada",
                closedAt: new Date().toISOString(),
                closedBy: user.id,
                closedByName: user.name,
                countedCash,
                notes,
              }
            : sh
        ),
      };
    });
  }, []);

  const addCashMovement = useCallback(
    (m: Omit<CashMovement, "id" | "createdAt" | "userId" | "userName" | "shiftId">) => {
      setState((s) => {
        const user = s.users.find((u) => u.id === s.currentUserId)!;
        const shift = s.shifts.find((sh) => sh.status === "abierta");
        if (!shift) return s;
        return {
          ...s,
          cashMovements: [
            {
              ...m,
              id: uid("cm"),
              createdAt: new Date().toISOString(),
              userId: user.id,
              userName: user.name,
              shiftId: shift.id,
            },
            ...s.cashMovements,
          ],
        };
      });
    },
    []
  );

  // ───────── Liquidations
  const generateLiquidations = useCallback(
    (periodLabel: string): Liquidation[] => {
      const result: Liquidation[] = [];
      setState((s) => {
        const user = s.users.find((u) => u.id === s.currentUserId)!;
        const [yr, mo] = periodLabel.split("-").map(Number);
        const inPeriod = (iso: string) => {
          const d = new Date(iso);
          return d.getFullYear() === yr && d.getMonth() + 1 === mo;
        };
        const sales = s.sales.filter(
          (sa) => sa.status === "completada" && inPeriod(sa.createdAt)
        );
        const byBrand = new Map<string, { items: SaleItem[]; refs: { saleId: string; itemIdx: number }[] }>();
        for (const sa of sales) {
          sa.items.forEach((it, idx) => {
            const cur = byBrand.get(it.brandId) ?? { items: [], refs: [] };
            cur.items.push(it);
            cur.refs.push({ saleId: sa.id, itemIdx: idx });
            byBrand.set(it.brandId, cur);
          });
        }
        const newLiqs: Liquidation[] = [];
        for (const [brandId, { items, refs }] of byBrand.entries()) {
          const brand = s.brands.find((b) => b.id === brandId)!;
          if (brand.model === "pieza_propia") continue;
          const totalSales = items.reduce((t, i) => t + i.lineTotal, 0);
          const brandTotal = items.reduce((t, i) => t + i.brandAmount, 0);
          const pisoTotal = items.reduce((t, i) => t + i.pisoAmount, 0);
          const existing = s.liquidations.find(
            (l) => l.brandId === brandId && l.periodLabel === periodLabel
          );
          newLiqs.push({
            id: existing?.id ?? uid("liq"),
            brandId,
            brandName: brand.name,
            periodLabel,
            totalSales,
            brandTotal,
            pisoTotal,
            status: existing?.status ?? "pendiente",
            paidAt: existing?.paidAt,
            paidBy: existing?.paidBy,
            saleItemRefs: refs,
            createdAt: existing?.createdAt ?? new Date().toISOString(),
          });
        }
        const otherLiqs = s.liquidations.filter((l) => l.periodLabel !== periodLabel);
        result.push(...newLiqs);
        void user;
        return { ...s, liquidations: [...otherLiqs, ...newLiqs] };
      });
      return result;
    },
    []
  );

  const markLiquidationPaid = useCallback((id: string) => {
    setState((s) => {
      const user = s.users.find((u) => u.id === s.currentUserId)!;
      return {
        ...s,
        liquidations: s.liquidations.map((l) =>
          l.id === id
            ? { ...l, status: "pagada", paidAt: new Date().toISOString(), paidBy: user.name }
            : l
        ),
      };
    });
  }, []);

  const value: Ctx = {
    state,
    currentUser,
    setRoleAs,
    resetAll,
    upsertBrand,
    upsertPiece,
    createSale,
    cancelSale,
    recordEntry,
    recordExit,
    createReservation,
    cancelReservation,
    convertReservationToSale,
    openShift,
    closeShift,
    addCashMovement,
    generateLiquidations,
    markLiquidationPaid,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

// ───────── helpers ─────────
export const fmtMXN = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);

export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

export const fmtDateTime = (iso: string) =>
  `${fmtDate(iso)} · ${fmtTime(iso)}`;

export const isToday = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

export const roleLabel = (r: Role) =>
  r === "admin" ? "Administrador" : r === "manager" ? "Manager" : "Empleado";

export const canSee = (role: Role, route: string) => {
  if (role === "admin") return true;
  if (role === "manager") {
    return !["usuarios", "configuracion"].includes(route);
  }
  // empleado
  return ["", "venta", "ventas", "piezas", "reservas", "caja"].includes(route);
};
