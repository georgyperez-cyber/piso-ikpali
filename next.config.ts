import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // La invitación general cambió de /soft-opening a /comite; los links ya
  // enviados siguen funcionando.
  async redirects() {
    return [{ source: "/soft-opening", destination: "/comite", permanent: false }];
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
