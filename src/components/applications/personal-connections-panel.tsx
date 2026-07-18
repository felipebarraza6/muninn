import { useEffect, useMemo, useState } from "react";
import { KeyRound, Loader2, Link2Off, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  useApplicationConnection,
  useConnectApplication,
  useCredentialFields,
  useDisconnectApplication,
  type ExternalAPI,
} from "@/api/hooks/useExternalAPIs";
import { toast } from "sonner";

function formatWhen(iso?: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-CL", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function PersonalConnectionsPanel({ api }: { api: ExternalAPI }) {
  const apiId = String(api.id);
  const { data: connection, isLoading, refetch } = useApplicationConnection(apiId);
  const { data: fieldsData, isLoading: fieldsLoading } = useCredentialFields(apiId);
  const connect = useConnectApplication();
  const disconnect = useDisconnectApplication();

  const fields = useMemo(() => {
    const fromApi = fieldsData?.fields ?? [];
    if (fromApi.length) return fromApi;
    // Fallback típico SmartHydro / DentyDesk
    return [
      { name: "email", type: "string", format: "email", required: true },
      { name: "password", type: "string", format: "password", required: true },
    ];
  }, [fieldsData?.fields]);

  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const f of fields) next[f.name] = "";
    setValues(next);
  }, [fields]);

  const connected = Boolean(connection?.is_connected);

  const onConnect = () => {
    const credentials: Record<string, string> = {};
    for (const f of fields) {
      const v = (values[f.name] ?? "").trim();
      if (!v && f.required !== false) {
        toast.error(`Completá «${f.name}»`);
        return;
      }
      if (v) credentials[f.name] = v;
    }
    connect.mutate(
      { external_api: apiId, credentials },
      {
        onSuccess: (r) => {
          if (r.success) {
            toast.success(`Cuenta de ${api.name} conectada`);
            setValues((prev) => {
              const cleared = { ...prev };
              for (const k of Object.keys(cleared)) {
                if (k.toLowerCase().includes("password") || k.toLowerCase().includes("secret")) {
                  cleared[k] = "";
                }
              }
              return cleared;
            });
            void refetch();
          } else {
            toast.error(r.error || "No se pudo conectar");
            void refetch();
          }
        },
        onError: (err) => {
          toast.error(
            (err as { friendlyMessage?: string })?.friendlyMessage ||
              "No se pudo conectar la cuenta",
          );
          void refetch();
        },
      },
    );
  };

  const onDisconnect = () => {
    if (!connection?.id) return;
    disconnect.mutate(connection.id, {
      onSuccess: () => {
        toast.success("Cuenta desconectada");
        void refetch();
      },
      onError: () => toast.error("No se pudo desconectar"),
    });
  };

  if (api.auth_type !== "endpoint_auth") {
    return null;
  }

  return (
    <section className="rounded-xl border bg-card/60 p-4 md:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" />
            Mi cuenta en {api.name}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
            Conectá tu usuario y clave una vez. Las skills usan esta cuenta automáticamente; no van
            a RAG ni al LLM.
          </p>
        </div>
        <Badge variant={connected ? "default" : "secondary"} className="text-[10px] self-start">
          {connected ? "Conectada" : "Sin conectar"}
        </Badge>
      </div>

      {isLoading || fieldsLoading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground py-4">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando…
        </div>
      ) : (
        <>
          {connected && (
            <div className="rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-xs space-y-1">
              <p className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                {connection?.label || "Cuenta guardada"}
              </p>
              <p className="text-muted-foreground">
                Última verificación: {formatWhen(connection?.last_verified_at)}
              </p>
              {connection?.last_error ? (
                <p className="text-destructive">{connection.last_error}</p>
              ) : null}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => {
              const inputType =
                f.format === "password" || f.name.toLowerCase().includes("password")
                  ? "password"
                  : f.format === "email" || f.name.toLowerCase().includes("email")
                    ? "email"
                    : "text";
              return (
                <div key={f.name} className="space-y-1.5">
                  <Label className="text-xs font-mono">
                    {f.name}
                    {f.required !== false && <span className="text-destructive"> *</span>}
                  </Label>
                  <Input
                    type={inputType}
                    autoComplete="off"
                    className="h-9"
                    value={values[f.name] ?? ""}
                    onChange={(e) => setValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
                    placeholder={
                      connected && inputType === "password"
                        ? "•••••••• (dejar vacío para no cambiar)"
                        : f.name
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" disabled={connect.isPending} onClick={onConnect}>
              {connect.isPending ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4 mr-1.5" />
              )}
              {connected ? "Actualizar y probar" : "Conectar y probar"}
            </Button>
            {connected && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive"
                disabled={disconnect.isPending}
                onClick={onDisconnect}
              >
                {disconnect.isPending ? (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                ) : (
                  <Link2Off className="h-4 w-4 mr-1.5" />
                )}
                Desconectar
              </Button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
