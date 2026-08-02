import { SiteShell } from "@/components/SiteShell";
import { FunPageClient } from "./FunPageClient";

export default function FunPage() {
  return (
    <SiteShell active="fun">
      <FunPageClient />
    </SiteShell>
  );
}
