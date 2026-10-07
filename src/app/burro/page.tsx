import InvitacionMarca, { metadataInvitacion } from "@/components/InvitacionMarca";

export const metadata = metadataInvitacion("Burro");

export default function BurroPage() {
  return <InvitacionMarca marca="Burro" />;
}
