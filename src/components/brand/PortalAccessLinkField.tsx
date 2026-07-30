import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  buildPortalAccessUrl,
  portalAccessHint,
  type PortalAccessSource,
} from "@/lib/portalAccessUrl";
import { copyToClipboard } from "@/lib/password";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type PortalAccessLinkFieldProps = {
  customDomain?: string | null;
  organizationDomain?: string | null;
  loginSlug?: string | null;
  className?: string;
};

export function PortalAccessLinkField({
  customDomain,
  organizationDomain,
  loginSlug,
  className,
}: PortalAccessLinkFieldProps) {
  const { url, source } = buildPortalAccessUrl({
    customDomain,
    organizationDomain,
    loginSlug,
  });
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const ok = await copyToClipboard(url);
    if (!ok) {
      toast.error("No se pudo copiar");
      return;
    }
    setCopied(true);
    toast.success("Link copiado");
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>Mi link para acceder</Label>
      <div className="flex gap-2">
        <Input readOnly value={url} className="text-sm" title={url} />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={() => void copy()}
          title="Copiar link"
          aria-label="Copiar link"
        >
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">{portalAccessHint(source)}</p>
      <AccessPriorityNote source={source} />
    </div>
  );
}

function AccessPriorityNote({ source }: { source: PortalAccessSource }) {
  if (source === "domain") return null;
  return (
    <p className="text-[11px] text-muted-foreground/90">
      Orden: dominio propio → dominio de la organización → nombre corto en esta app.
    </p>
  );
}
