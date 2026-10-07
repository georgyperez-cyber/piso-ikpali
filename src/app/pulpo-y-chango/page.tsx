import InvitacionMarca, { metadataInvitacion } from "@/components/InvitacionMarca";

export const metadata = metadataInvitacion("Pulpo y chango");

export default function PulpoYChangoPage() {
  return <InvitacionMarca marca="Pulpo y chango" />;
}
