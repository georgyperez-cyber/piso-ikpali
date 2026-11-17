"use client";

// Al final de /softopening: sube al bloque rojo del inicio y abre el formulario.
export default function BotonConfirmar() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("rsvp:abrir"))}
      className="group inline-flex items-center gap-4 bg-rojo text-blanco px-6 py-4 font-medium text-[22px] md:text-[24px] tracking-[-0.01em] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rojo"
    >
      confirmar asistencia
      <span aria-hidden className="inline-block transition-transform duration-300 group-hover:-translate-y-1">↑</span>
    </button>
  );
}
