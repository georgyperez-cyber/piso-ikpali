import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // /softopening es la invitación al soft opening del 5 de diciembre con su RSVP.
  // /soft-opening (antes redirigía a /comite, que ya pasó) y /rsvp llegan ahí.
  async redirects() {
    return [
      { source: "/soft-opening", destination: "/softopening", permanent: false },
      { source: "/rsvp", destination: "/softopening", permanent: false },
    ];
  },
  // El panel de administración (inventario, ventas, caja) corre en Railway y se
  // sirve bajo /admin. Next no debe quitar la diagonal final: el panel la necesita.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    const admin = "https://admin-production-6e09.up.railway.app";
    return [
      { source: "/admin", destination: `${admin}/admin` },
      { source: "/admin/:path*", destination: `${admin}/admin/:path*` },
    ];
  },
};

export default nextConfig;
