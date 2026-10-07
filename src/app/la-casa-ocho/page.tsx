import InvitacionMarca, { metadataInvitacion } from "@/components/InvitacionMarca";

export const metadata = metadataInvitacion("La Casa Ocho");

export default function LaCasaOchoPage() {
  return <InvitacionMarca marca="La Casa Ocho" />;
}
