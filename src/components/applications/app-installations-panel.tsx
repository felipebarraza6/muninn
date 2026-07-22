import { useEffect, useMemo, useState } from "react";
import { Building2, KeyRound, Link2Off, Loader2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useConnectInstallation,
  useCredentialFields,
  useDisconnectInstallationAccount,
  useExternalAPIInstallations,
  useUpdateExternalAPI,
  type ExternalAPI,
  type ExternalAPIInstallation,
} from "@/api/hooks/useExternalAPIs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type BranchOption = { id: string; label: string };

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

function serverInstalledIds(
  api: ExternalAPI,
  installations: ExternalAPIInstallation[],
  installationsLoaded: boolean,
): string[] {
  const ids = new Set<string>();
  for (const inst of installations) {
    if (inst.is_active !== false) ids.add(String(inst.branch));
  }
  // Solo fallback mientras carga: si ya cargó y está vacío, es «sin instalaciones»
  // (no usar api.branch: es ancla técnica y reaparecía la sucursal desinstalada).
  if (ids.size === 0 && !installationsLoaded) {
    for (const b of api.branches ?? []) ids.add(String(b));
  }
  return Array.from(ids);
}

/**
 * Instalaciones = app × sucursal + cuenta de servicio (la usan los agentes).
 * Instalar/desinstalar es inmediato. La cuenta de servicio se edita en un modal.
 */
export function AppInstallationsPanel({
  api,
  branchOptions,
  canManage,
  onSaved,
}: {
  api: ExternalAPI;
  branchOptions: BranchOption[];
  canManage: boolean;
  onSaved?: () => void;
}) {
  const update = useUpdateExternalAPI();
  const {
    data: installations = [],
    refetch: refetchInstallations,
    isLoading: installationsLoading,
    isFetched: installationsFetched,
    isError: installationsError,
    error: installationsErr,
  } = useExternalAPIInstallations(String(api.id));
  const { data: fieldsData } = useCredentialFields(
    api.auth_type === "endpoint_auth" ? String(api.id) : undefined,
  );
  const connectInstall = useConnectInstallation();
  const disconnectAccount = useDisconnectInstallationAccount();

  const [search, setSearch] = useState("");
  /** Optimistic override mientras corre el PATCH; null = usar servidor. */
  const [optimisticIds, setOptimisticIds] = useState<string[] | null>(null);
  const [accountBranchId, setAccountBranchId] = useState<string | null>(null);
  const [credValues, setCredValues] = useState<Record<string, string>>({});

  const serverIds = useMemo(
    () => serverInstalledIds(api, installations, installationsFetched && !installationsError),
    [api, installations, installationsFetched, installationsError],
  );
  const selected = optimisticIds ?? serverIds;

  // Si el servidor converge con lo optimista, soltar el override.
  useEffect(() => {
    if (optimisticIds == null) return;
    const a = [...optimisticIds].sort().join(",");
    const b = [...serverIds].sort().join(",");
    if (a === b) setOptimisticIds(null);
  }, [optimisticIds, serverIds]);

  const installByBranch = useMemo(() => {
    const map = new Map<string, ExternalAPIInstallation>();
    for (const inst of installations) {
      map.set(String(inst.branch), inst);
    }
    return map;
  }, [installations]);

  const fields = useMemo(() => {
    const fromApi = fieldsData?.fields ?? [];
    if (fromApi.length) return fromApi;
    return [
      { name: "email", type: "string", format: "email", required: true },
      { name: "password", type: "string", format: "password", required: true },
    ];
  }, [fieldsData?.fields]);

  useEffect(() => {
    if (!accountBranchId) return;
    const next: Record<string, string> = {};
    for (const f of fields) next[f.name] = "";
    setCredValues(next);
  }, [fields, accountBranchId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return branchOptions;
    return branchOptions.filter((b) => b.label.toLowerCase().includes(q));
  }, [branchOptions, search]);

  const persistBranches = (nextIds: string[]) => {
    if (!canManage || update.isPending) return;
    const prev = selected;
    setOptimisticIds(nextIds);
    update.mutate(
      {
        id: String(api.id),
        data: {
          branches: nextIds.map((bid) => (Number.isNaN(Number(bid)) ? bid : Number(bid))),
        },
      },
      {
        onSuccess: () => {
          void refetchInstallations();
          onSaved?.();
        },
        onError: (err) => {
          setOptimisticIds(prev);
          toast.error(
            (err as { friendlyMessage?: string })?.friendlyMessage ||
              "No se pudieron actualizar las instalaciones",
          );
        },
      },
    );
  };

  const toggle = (id: string) => {
    if (!canManage || update.isPending) return;
    const isOn = selected.includes(id);
    const next = isOn ? selected.filter((x) => x !== id) : [...selected, id];
    persistBranches(next);
  };

  const accountBranch = branchOptions.find((b) => b.id === accountBranchId);
  const accountInst = accountBranchId ? installByBranch.get(accountBranchId) : undefined;
  const accountHasCreds = Boolean(accountInst?.has_credentials);

  const onConnectService = () => {
    if (!accountBranchId || !accountInst?.id) {
      toast.error("La instalación aún no está lista; reintentá en un momento");
      return;
    }
    const credentials: Record<string, string> = {};
    for (const f of fields) {
      const v = (credValues[f.name] ?? "").trim();
      if (!v && f.required !== false) {
        toast.error(`Completá «${f.name}»`);
        return;
      }
      if (v) credentials[f.name] = v;
    }
    connectInstall.mutate(
      { id: accountInst.id, credentials },
      {
        onSuccess: (r) => {
          if (r.success) {
            toast.success("Cuenta de la instalación conectada");
            setAccountBranchId(null);
            void refetchInstallations();
            onSaved?.();
          } else {
            toast.error(r.error || "No se pudo conectar");
            void refetchInstallations();
          }
        },
        onError: (err) => {
          toast.error(
            (err as { friendlyMessage?: string })?.friendlyMessage ||
              "No se pudo conectar la cuenta de servicio",
          );
          void refetchInstallations();
        },
      },
    );
  };

  const onDisconnectService = () => {
    if (!accountInst?.id) return;
    disconnectAccount.mutate(accountInst.id, {
      onSuccess: () => {
        toast.success("Cuenta de servicio desconectada");
        void refetchInstallations();
        onSaved?.();
      },
      onError: () => toast.error("No se pudo desconectar"),
    });
  };

  if (branchOptions.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-border/80 py-10 text-center space-y-2">
        <Building2 className="h-8 w-8 mx-auto text-muted-foreground/60" />
        <p className="text-sm font-medium">Sin sucursales disponibles</p>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          No hay sucursales en tu alcance para instalar esta aplicación.
        </p>
      </section>
    );
  }

  const showAccount = api.auth_type === "endpoint_auth";
  const saving = update.isPending;

  return (
    <section className="space-y-5">
      <div className="border-b border-border/60 pb-3 space-y-1">
        <h2 className="text-sm font-medium flex items-center gap-2">
          <Store className="h-4 w-4 text-primary" />
          Instalaciones
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" /> : null}
        </h2>
        <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
          Tocá una sucursal para instalar o desinstalar. La app puede quedar sin instalaciones. En
          cada una configurá la{" "}
          <strong className="text-foreground font-medium">cuenta de servicio</strong> que usan los
          agentes.
        </p>
      </div>

      {installationsError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive space-y-1">
          <p className="font-medium">No se pudieron cargar las instalaciones</p>
          <p className="text-destructive/90">
            {(installationsErr as { friendlyMessage?: string })?.friendlyMessage ||
              "El endpoint de instalaciones no respondió. Si acabás de actualizar el backend, reiniciá la API."}
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-1"
            onClick={() => void refetchInstallations()}
          >
            Reintentar
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant="outline" className="text-[11px] font-normal">
          {selected.length} instalada{selected.length === 1 ? "" : "s"}
        </Badge>
        {canManage && (
          <div className="flex items-center gap-2 text-[11px]">
            <button
              type="button"
              className="text-primary hover:underline disabled:opacity-50"
              disabled={saving}
              onClick={() => persistBranches(branchOptions.map((b) => b.id))}
            >
              Instalar en todas
            </button>
            <span className="text-muted-foreground">·</span>
            <button
              type="button"
              className="text-muted-foreground hover:underline disabled:opacity-50"
              disabled={saving || selected.length === 0}
              onClick={() => persistBranches([])}
            >
              Ninguna
            </button>
          </div>
        )}
      </div>

      {branchOptions.length > 6 && (
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar sucursal…"
          className="h-9 max-w-sm"
        />
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {filtered.map((b) => {
          const installed = selected.includes(b.id);
          const inst = installByBranch.get(b.id);
          const needsReconnect = Boolean(inst?.needs_reconnect || inst?.credentials_unreadable);
          const hasCreds = Boolean(inst?.has_credentials) && !needsReconnect;
          return (
            <div
              key={b.id}
              className={cn(
                "flex flex-col gap-2 rounded-xl border px-3 py-3 transition-colors",
                installed ? "border-primary/40 bg-primary/8" : "border-border/70 bg-card/40",
              )}
            >
              <button
                type="button"
                disabled={!canManage || saving}
                onClick={() => toggle(b.id)}
                className={cn(
                  "flex items-start gap-3 text-left w-full",
                  (!canManage || saving) && "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px]",
                    installed
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40",
                  )}
                >
                  {installed ? "✓" : ""}
                </span>
                <span className="min-w-0 flex-1 space-y-0.5">
                  <span className="block text-sm font-medium truncate">{b.label}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {installed
                      ? "Instalada — tocá para desinstalar"
                      : "No instalada — tocá para instalar"}
                  </span>
                </span>
              </button>

              {installed && showAccount && (
                <div className="flex flex-col gap-1.5 pl-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={needsReconnect ? "destructive" : hasCreds ? "default" : "secondary"}
                      className="text-[10px] font-normal"
                    >
                      {needsReconnect
                        ? "Credenciales inválidas — reconectar"
                        : hasCreds
                          ? `Con cuenta: ${inst?.label || "servicio"}`
                          : "Sin cuenta"}
                    </Badge>
                    {canManage && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline disabled:opacity-50"
                        disabled={installationsLoading || installationsError}
                        onClick={() => {
                          if (!inst?.id) {
                            toast.error(
                              "Todavía no hay fila de instalación para esta sucursal. Reintentá cargar o reinstalá.",
                            );
                            void refetchInstallations();
                            return;
                          }
                          setAccountBranchId(b.id);
                        }}
                      >
                        <KeyRound className="h-3 w-3" />
                        {needsReconnect
                          ? "Reconectar cuenta"
                          : hasCreds
                            ? "Gestionar cuenta"
                            : "Conectar cuenta de servicio"}
                      </button>
                    )}
                  </div>
                  {needsReconnect && (
                    <p className="text-[11px] text-destructive/90 leading-snug">
                      {inst?.last_error ||
                        "Las credenciales no se pueden leer (posible cambio de clave). Volvé a conectar la cuenta."}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Dialog
        open={accountBranchId != null}
        onOpenChange={(open) => {
          if (!open) setAccountBranchId(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Cuenta de la instalación</DialogTitle>
            <DialogDescription className="text-xs">
              Credenciales de servicio para{" "}
              <strong className="text-foreground font-medium">
                {accountBranch?.label ?? "esta sucursal"}
              </strong>
              . Las usan los agentes; no es tu cuenta personal de prueba.
            </DialogDescription>
          </DialogHeader>

          {accountHasCreds && (
            <div className="rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-xs space-y-1">
              <p className="font-medium">{accountInst?.label || "Cuenta conectada"}</p>
              <p className="text-muted-foreground">
                Última verificación: {formatWhen(accountInst?.last_verified_at)}
              </p>
              {accountInst?.last_error ? (
                <p className="text-destructive">{accountInst.last_error}</p>
              ) : null}
            </div>
          )}

          <div className="grid gap-3">
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
                    value={credValues[f.name] ?? ""}
                    onChange={(e) =>
                      setCredValues((prev) => ({ ...prev, [f.name]: e.target.value }))
                    }
                    placeholder={accountHasCreds && inputType === "password" ? "••••••••" : f.name}
                  />
                </div>
              );
            })}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {accountHasCreds && accountInst?.id && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive sm:mr-auto"
                disabled={disconnectAccount.isPending || connectInstall.isPending}
                onClick={onDisconnectService}
              >
                {disconnectAccount.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Link2Off className="h-3.5 w-3.5 mr-1.5" />
                )}
                Quitar cuenta
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              disabled={connectInstall.isPending || !accountInst?.id}
              onClick={onConnectService}
            >
              {connectInstall.isPending ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <KeyRound className="h-3.5 w-3.5 mr-1.5" />
              )}
              Conectar y probar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
