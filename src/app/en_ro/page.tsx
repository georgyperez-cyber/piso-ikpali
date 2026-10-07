import InvitacionMarca, { metadataInvitacion } from "@/components/InvitacionMarca";

export const metadata = metadataInvitacion("en_ro");

export default function EnRoPage() {
  return <InvitacionMarca marca="en_ro" />;
}
