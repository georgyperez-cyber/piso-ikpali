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
};

export default nextConfig;
