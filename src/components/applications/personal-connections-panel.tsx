import { useEffect, useMemo, useState } from "react";
import { KeyRound, Loader2, Link2Off, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useApplicationConnection,
  useConnectApplication,
  useCredentialFields,
  useDisconnectApplication,
  type ExternalAPI,
} from "@/api/hooks/useExternalAPIs";
import { AppCredentialFieldsForm } from "@/components/applications/app-credential-fields-form";
import { canOfferInstallationCredentials, resolveCredentialFields } from "@/lib/external-api";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";
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

/**
 * Cuenta personal de prueba (Studio / Probar).
 * Sin selector de sucursal: eso vive en Instalación (cuenta de servicio).
 */
export function PersonalConnectionsPanel({ api }: { api: ExternalAPI }) {
  const apiId = String(api.id);
  const branchId = useActiveBranchId();
  const needsCreds = canOfferInstallationCredentials(api);
  const {
    data: connection,
    isLoading,
    refetch,
  } = useApplicationConnection(needsCreds ? apiId : undefined);
  const { data: fieldsData, isLoading: fieldsLoading } = useCredentialFields(
    needsCreds ? apiId : undefined,
  );
  const connect = useConnectApplication();
  const disconnect = useDisconnectApplication();

  const fields = useMemo(
    () =>
      resolveCredentialFields(api.auth_type, fieldsData?.fields, {
        baseUrl: api.base_url,
        name: api.name,
      }),
    [api.auth_type, api.base_url, api.name, fieldsData?.fields],
  );

  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const f of fields) next[f.name] = "";
    setValues(next);
  }, [fields, apiId]);

  const connected = Boolean(connection?.is_connected);

  const onConnect = () => {
    const credentials: Record<string, string> = {};
    for (const f of fields) {
      const v = (values[f.name] ?? "").trim();
      if (!v && f.required !== false) {
        toast.error(`Completa «${f.label || f.name}»`);
        return;
      }
      if (v) credentials[f.name] = v;
    }
    connect.mutate(
      {
        external_api: apiId,
        credentials,
        ...(branchId != null ? { branch: branchId } : {}),
      },
      {
        onSuccess: (r) => {
          if (r.success) {
            toast.success("Cuenta de prueba conectada");
            setValues((prev) => {
              const cleared = { ...prev };
              for (const k of Object.keys(cleared)) {
                if (/password|secret|token|key|api_key/i.test(k)) cleared[k] = "";
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
              "No se pudo conectar la cuenta de prueba",
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
        toast.success("Cuenta de prueba desconectada");
        void refetch();
      },
      onError: () => toast.error("No se pudo desconectar"),
    });
  };

  if (!needsCreds) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <h2 className="text-sm font-medium flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" />
            Cuenta de prueba · {api.name}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
            Credenciales <strong className="text-foreground font-medium">tuyas</strong> solo para
            Studio / Probar. Los agentes no las usan: ellos van con la{" "}
            <strong className="text-foreground font-medium">cuenta de servicio</strong> de la
            pestaña Instalación.
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
                {connection?.label || "Cuenta de prueba guardada"}
              </p>
              <p className="text-muted-foreground">
                Última verificación: {formatWhen(connection?.last_verified_at)}
              </p>
              {connection?.last_error ? (
                <p className="text-destructive">{connection.last_error}</p>
              ) : null}
            </div>
          )}

          <AppCredentialFieldsForm
            authType={api.auth_type}
            fieldsFromApi={fieldsData?.fields}
            apiHints={{ baseUrl: api.base_url, name: api.name }}
            values={values}
            connected={connected}
            className="max-w-2xl"
            onChange={(name, value) => setValues((prev) => ({ ...prev, [name]: value }))}
          />

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
