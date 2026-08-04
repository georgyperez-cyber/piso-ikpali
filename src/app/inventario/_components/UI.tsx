"use client";

import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-[10px] tracking-[0.22em] uppercase text-rojo/70 ${className}`}>
      {children}
    </span>
  );
}

export function Pill({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "ok" | "warn" | "off" | "rojo";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "border-rojo/30 text-rojo/80",
    ok: "border-rojo/60 text-rojo bg-rojo/5",
    warn: "border-rojo text-blanco bg-rojo",
    off: "border-negro/15 text-negro/45",
    rojo: "border-rojo text-blanco bg-rojo",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 border px-2 py-[2px] text-[10px] tracking-[0.18em] uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={`bg-blanco border border-rojo/15 ${className}`}
    >
      {children}
    </div>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  variant = "outline",
  size = "md",
  className = "",
  children,
  ...rest
}: BtnProps) {
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-[11px] tracking-[0.18em] uppercase",
    md: "h-10 px-4 text-[11px] tracking-[0.2em] uppercase",
    lg: "h-12 px-6 text-[12px] tracking-[0.22em] uppercase",
  };
  const variants: Record<string, string> = {
    primary:
      "bg-rojo text-blanco border border-rojo hover:bg-rojo/90 active:bg-rojo/80 disabled:opacity-40 disabled:cursor-not-allowed",
    outline:
      "bg-blanco text-rojo border border-rojo hover:bg-rojo/5 active:bg-rojo/10 disabled:opacity-40 disabled:cursor-not-allowed",
    ghost:
      "bg-transparent text-rojo border border-transparent hover:bg-rojo/5 active:bg-rojo/10 disabled:opacity-40",
    danger:
      "bg-blanco text-rojo border border-rojo hover:bg-rojo hover:text-blanco transition-colors",
  };
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Input({ className = "", ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      className={`h-10 w-full bg-blanco border border-rojo/30 px-3 text-[13px] text-rojo placeholder:text-rojo/40 focus:outline-none focus:border-rojo ${className}`}
    />
  );
}

export function Select({ className = "", children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...rest}
      className={`h-10 w-full bg-blanco border border-rojo/30 px-3 text-[13px] text-rojo focus:outline-none focus:border-rojo ${className}`}
    >
      {children}
    </select>
  );
}

export function Textarea({ className = "", ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...rest}
      className={`w-full bg-blanco border border-rojo/30 px-3 py-2 text-[13px] text-rojo placeholder:text-rojo/40 focus:outline-none focus:border-rojo min-h-[80px] resize-y ${className}`}
    />
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] tracking-[0.18em] uppercase text-rojo/70">{label}</span>
      {children}
      {hint ? <span className="text-[11px] text-rojo/50 font-light">{hint}</span> : null}
    </label>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6 pb-6 border-b border-rojo/15 mb-6">
      <div>
        {eyebrow ? <div className="mb-2"><Eyebrow>{eyebrow}</Eyebrow></div> : null}
        <h1
          className="text-rojo font-medium leading-none"
          style={{ fontSize: "clamp(28px, 3.4vw, 44px)", letterSpacing: "-0.015em" }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-[13px] font-light text-rojo/70 max-w-[60ch]">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="flex items-center gap-3">{right}</div> : null}
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  className = "",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`p-5 flex flex-col gap-2 ${className}`}>
      <Eyebrow>{label}</Eyebrow>
      <div
        className="text-rojo font-medium leading-[0.9] tabular-nums"
        style={{ fontSize: "clamp(28px, 3vw, 42px)", letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
      {sub ? <div className="text-[11px] text-rojo/60 font-light">{sub}</div> : null}
    </Card>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="border border-dashed border-rojo/30 px-6 py-16 text-center text-[12px] text-rojo/60 font-light">
      {children}
    </div>
  );
}

export function TH({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-[10px] tracking-[0.18em] uppercase text-rojo/70 font-medium px-3 py-3 border-b border-rojo/20 ${className}`}
    >
      {children}
    </th>
  );
}

export function TD({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-3 py-3 text-[13px] text-rojo border-b border-rojo/10 ${className}`}>
      {children}
    </td>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-rojo/20 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-blanco border border-rojo/30 w-full max-w-[560px] max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-rojo/15">
          <h2
            className="text-rojo font-medium"
            style={{ fontSize: "18px", letterSpacing: "-0.01em" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[11px] tracking-[0.2em] uppercase text-rojo/60 hover:text-rojo"
          >
            cerrar
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer ? (
          <div className="px-6 py-4 border-t border-rojo/15 flex items-center justify-end gap-2">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
