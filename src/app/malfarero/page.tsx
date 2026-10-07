import InvitacionMarca, { metadataInvitacion } from "@/components/InvitacionMarca";

export const metadata = metadataInvitacion("Malfarero");

export default function MalfareroPage() {
  return <InvitacionMarca marca="Malfarero" />;
}
