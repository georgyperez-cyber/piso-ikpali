// ───────── Roles ─────────
export type Role = "admin" | "manager" | "empleado";

export type User = {
  id: string;
  name: string;
  role: Role;
  active: boolean;
};

// ───────── Marca ─────────
export type CommercialModel =
  | "consignacion"
  | "compra_directa"
  | "pieza_propia"
  | "colaboracion";

export type BrandStatus = "activa" | "pausada" | "cerrada";

export type Brand = {
  id: string;
  name: string;
  contact: string;
  phone?: string;
  instagram?: string;
  brandPct: number; // e.g. 65
  pisoPct: number;  // e.g. 35
  model: CommercialModel;
  status: BrandStatus;
  notes?: string;
  createdAt: string;
};

// ───────── Pieza ─────────
export type Category =
  | "ceramica"
  | "iluminacion"
  | "textil"
  | "escultura"
  | "objeto"
  | "mobiliario"
  | "editorial"
  | "vela";

export type PieceStatus =
  | "en_piso"
  | "vendida"
  | "reservada"
  | "devuelta_a_marca"
  | "danada"
  | "prestada"
  | "retirada"
  | "en_revision";

export type Piece = {
  id: string;
  name: string;
  brandId: string;
  category: Category;
  shortDescription?: string;
  curatorialNote?: string;
  material?: string;
  dimensions?: string;
  imageIdx: number; // 1..8 hero icon index
  price: number;
  brandPct: number;
  pisoPct: number;
  initialStock: number;
  currentStock: number;
  isUnique: boolean;
  isConsignment: boolean;
  status: PieceStatus;
  location?: string;
  entryDate: string;
  reviewDate?: string;
  receivedBy?: string;
  createdAt: string;
};

// ───────── Venta ─────────
export type PaymentMethod = "efectivo" | "tarjeta";
export type SaleStatus = "completada" | "cancelada" | "devuelta";

export type SaleItem = {
  pieceId: string;
  pieceName: string;
  brandId: string;
  brandName: string;
  qty: number;
  unitPrice: number;
  brandPct: number;
  pisoPct: number;
  brandAmount: number;
  pisoAmount: number;
  lineTotal: number;
};

export type Sale = {
  id: string;
  folio: string;
  userId: string;
  userName: string;
  shiftId?: string;
  items: SaleItem[];
  total: number;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  change?: number;
  status: SaleStatus;
  createdAt: string;
  cancelledAt?: string;
  cancelReason?: string;
};

// ───────── Movimientos de inventario ─────────
export type MovementType =
  | "entrada"
  | "venta"
  | "venta_cancelada"
  | "devolucion_a_marca"
  | "danada"
  | "prestada"
  | "regreso_prestamo"
  | "rotacion_curatorial"
  | "ajuste"
  | "reserva"
  | "reserva_cancelada";

export type InventoryMovement = {
  id: string;
  pieceId: string;
  pieceName: string;
  brandId: string;
  type: MovementType;
  reason?: string;
  qty: number;          // signed: + entries, - exits
  stockBefore: number;
  stockAfter: number;
  userId: string;
  userName: string;
  note?: string;
  createdAt: string;
};

// ───────── Reserva ─────────
export type ReservationStatus = "activa" | "convertida" | "cancelada" | "expirada";

export type Reservation = {
  id: string;
  pieceId: string;
  pieceName: string;
  customerName: string;
  customerContact?: string;
  qty: number;
  reservedBy: string;
  reservedAt: string;
  expiresAt: string;
  status: ReservationStatus;
  note?: string;
  convertedSaleId?: string;
};

// ───────── Caja ─────────
export type ShiftStatus = "abierta" | "cerrada";

export type CashMovement = {
  id: string;
  shiftId: string;
  type: "entrada" | "salida";
  amount: number;
  reason: string;
  userId: string;
  userName: string;
  note?: string;
  createdAt: string;
};

export type CashShift = {
  id: string;
  openedBy: string;
  openedByName: string;
  closedBy?: string;
  closedByName?: string;
  openedAt: string;
  closedAt?: string;
  openingCash: number;
  countedCash?: number;
  status: ShiftStatus;
  notes?: string;
};

// ───────── Liquidación ─────────
export type LiquidationStatus = "pendiente" | "pagada";

export type Liquidation = {
  id: string;
  brandId: string;
  brandName: string;
  periodLabel: string; // "2026-05"
  totalSales: number;
  brandTotal: number;
  pisoTotal: number;
  status: LiquidationStatus;
  paidAt?: string;
  paidBy?: string;
  saleItemRefs: { saleId: string; itemIdx: number }[];
  createdAt: string;
};
