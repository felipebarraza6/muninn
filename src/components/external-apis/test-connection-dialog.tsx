import { useEffect, useMemo, useState } from "react";
import { FlaskConical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useTestExternalAPI,
  type ExternalAPI,
  type ExternalAPITestResult,
} from "@/api/hooks/useExternalAPIs";
import {
  formatTestResultToast,
  HTTP_METHODS,
  parseJsonObject,
  prettyJson,
} from "@/lib/external-api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TestConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  api: ExternalAPI;
}

type Mode = "endpoint" | "adhoc" | "base";

export function TestConnectionDialog({ open, onOpenChange, api }: TestConnectionDialogProps) {
  const test = useTestExternalAPI();
  const endpointKeys = useMemo(() => Object.keys(api.endpoints ?? {}), [api.endpoints]);

  const [mode, setMode] = useState<Mode>(endpointKeys.length ? "endpoint" : "base");
  const [endpointType, setEndpointType] = useState(endpointKeys[0] ?? "");
  const [bodyJson, setBodyJson] = useState("{}");
  const [authenticateFirst, setAuthenticateFirst] = useState(false);
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/");
  const [headersJson, setHeadersJson] = useState("{}");
  const [paramsJson, setParamsJson] = useState("{}");
  const [lastResult, setLastResult] = useState<ExternalAPITestResult | null>(null);

  useEffect(() => {
    if (!open) return;
    setMode(endpointKeys.length ? "endpoint" : "base");
    setEndpointType(endpointKeys[0] ?? "");
    setBodyJson("{}");
    setAuthenticateFirst(Boolean(api.auth_endpoint_key));
    setMethod("GET");
    setPath("/");
    setHeadersJson("{}");
    setParamsJson("{}");
    setLastResult(null);
  }, [open, endpointKeys, api.auth_endpoint_key]);

  const run = () => {
    if (mode === "endpoint") {
      if (!endpointType) {
        toast.error("Selecciona un endpoint");
        return;
      }
      const body = parseJsonObject(bodyJson, "body");
      if (!body.ok) {
        toast.error(body.error);
        return;
      }
      test.mutate(
        {
          id: String(api.id),
          body: {
            endpoint_type: endpointType,
            body: body.value,
            authenticate_first: authenticateFirst,
          },
        },
        {
          onSuccess: (r) => {
            setLastResult(r);
            const msg = formatTestResultToast(r);
            if (msg.ok) toast.success(msg.message);
            else toast.error(msg.message);
          },
          onError: () => toast.error("Test falló"),
        },
      );
      return;
    }

    if (mode === "adhoc") {
      const headers = parseJsonObject(headersJson, "headers");
      if (!headers.ok) {
        toast.error(headers.error);
        return;
      }
      const params = parseJsonObject(paramsJson, "params");
      if (!params.ok) {
        toast.error(params.error);
        return;
      }
      const body = parseJsonObject(bodyJson, "body");
      if (!body.ok) {
        toast.error(body.error);
        return;
      }
      if (!path.startsWith("/")) {
        toast.error("El path debe empezar con /");
        return;
      }
      test.mutate(
        {
          id: String(api.id),
          body: {
            method,
            path,
            headers: headers.value,
            params: params.value,
            body: body.value,
            authenticate_first: authenticateFirst,
          },
        },
        {
          onSuccess: (r) => {
            setLastResult(r);
            const msg = formatTestResultToast(r);
            if (msg.ok) toast.success(msg.message);
            else toast.error(msg.message);
          },
          onError: () => toast.error("Test falló"),
        },
      );
      return;
    }

    test.mutate(
      {
        id: String(api.id),
        body: { authenticate_first: authenticateFirst },
      },
      {
        onSuccess: (r) => {
          setLastResult(r);
          const msg = formatTestResultToast(r);
          if (msg.ok) toast.success(msg.message);
          else toast.error(msg.message);
        },
        onError: () => toast.error("Test falló"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Probar conexión — {api.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Modo</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="endpoint" disabled={endpointKeys.length === 0}>
                  Endpoint configurado
                </SelectItem>
                <SelectItem value="adhoc">Request ad-hoc</SelectItem>
                <SelectItem value="base">GET a base_url</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === "endpoint" && (
            <>
              <div className="space-y-2">
                <Label>Endpoint</Label>
                <Select value={endpointType} onValueChange={setEndpointType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {endpointKeys.map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Parámetros / body (JSON)</Label>
                <Textarea
                  value={bodyJson}
                  onChange={(e) => setBodyJson(e.target.value)}
                  rows={5}
                  className="font-mono text-xs"
                />
              </div>
            </>
          )}

          {mode === "adhoc" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Método</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HTTP_METHODS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Path</Label>
                  <Input
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    className="font-mono text-sm"
                    placeholder="/health"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>headers (JSON)</Label>
                <Textarea
                  value={headersJson}
                  onChange={(e) => setHeadersJson(e.target.value)}
                  rows={3}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label>params (JSON)</Label>
                <Textarea
                  value={paramsJson}
                  onChange={(e) => setParamsJson(e.target.value)}
                  rows={3}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label>body (JSON)</Label>
                <Textarea
                  value={bodyJson}
                  onChange={(e) => setBodyJson(e.target.value)}
                  rows={4}
                  className="font-mono text-xs"
                />
              </div>
            </>
          )}

          {mode === "base" && (
            <p className="text-xs text-muted-foreground">
              Envía un GET a la URL base de la API (útil como health check rápido).
            </p>
          )}

          {Boolean(api.auth_endpoint_key) && (
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={authenticateFirst} onCheckedChange={setAuthenticateFirst} />
              Autenticar primero ({api.auth_endpoint_key})
            </label>
          )}

          {lastResult && (
            <div
              className={cn(
                "rounded-lg border p-3 space-y-2 text-xs",
                lastResult.success
                  ? "border-primary/30 bg-primary/5"
                  : "border-destructive/30 bg-destructive/5",
              )}
            >
              <div className="flex flex-wrap gap-2 font-medium">
                <span>{lastResult.success ? "Éxito" : "Error"}</span>
                {lastResult.status_code != null && <span>HTTP {lastResult.status_code}</span>}
                {lastResult.latency_ms != null && <span>{lastResult.latency_ms} ms</span>}
              </div>
              {lastResult.error && <p className="text-destructive">{lastResult.error}</p>}
              {lastResult.auth?.token_preview && (
                <p className="text-muted-foreground font-mono">
                  Token: {lastResult.auth.token_preview}
                </p>
              )}
              <pre className="max-h-40 overflow-auto rounded bg-background/60 p-2 font-mono whitespace-pre-wrap break-all">
                {prettyJson(lastResult.data ?? lastResult.raw_response ?? lastResult)}
              </pre>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button type="button" disabled={test.isPending} onClick={run}>
            {test.isPending ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <FlaskConical className="h-4 w-4 mr-1.5" />
            )}
            Ejecutar test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
