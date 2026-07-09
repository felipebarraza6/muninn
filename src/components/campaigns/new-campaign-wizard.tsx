import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Send, Sparkles, FileSpreadsheet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CAMPAIGN_KIND_LABEL,
  campaignHints,
  type CampaignAudienceMember,
  type CampaignHint,
  type CampaignKind,
  type CampaignSource,
} from "@/lib/mock-data";
import { formatCLP, formatNumber, pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CAMPAIGN_KIND_ICON } from "./campaign-hint-icon";
import { CsvImport, type ParsedCsvResult } from "./csv-import";
import { AudienceReviewTable } from "./audience-review-table";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialKind?: CampaignKind | null;
}

const STEP_LABELS = ["Origen", "Audiencia", "Mensaje y ritmo", "Revisar lista"];

/** Genera audiencia mock para una pista (sólo demo, ya que no tenemos backend). */
function buildHintAudience(hint: CampaignHint): CampaignAudienceMember[] {
  const sample = Math.min(hint.audienceSize, 60); // cap visual
  const treatments = ["Implante", "Ortodoncia", "Limpieza", "Endodoncia", "Blanqueamiento"];
  const firstNames = [
    "María",
    "Pedro",
    "Ana",
    "Juan",
    "Camila",
    "Diego",
    "Fernanda",
    "Tomás",
    "Valentina",
    "Andrés",
    "Patricia",
    "Rodrigo",
    "Sofía",
    "Matías",
    "Constanza",
  ];
  const lastNames = [
    "González",
    "Soto",
    "Pérez",
    "Rojas",
    "Torres",
    "Salinas",
    "López",
    "Ríos",
    "Silva",
    "Herrera",
    "Muñoz",
    "Vargas",
    "Reyes",
    "Núñez",
    "Cifuentes",
  ];
  return Array.from({ length: sample }, (_, i) => {
    const first = firstNames[i % firstNames.length];
    const last = lastNames[(i * 3) % lastNames.length];
    const phone = `+56 9 ${String(1000 + ((i * 137) % 9000)).padStart(4, "0")} ${String(1000 + ((i * 211) % 9000)).padStart(4, "0")}`;
    const value =
      hint.audienceSize > 0
        ? Math.round((hint.estimatedValue / hint.audienceSize) * (0.6 + (i % 7) * 0.12))
        : 0;
    return {
      id: `${hint.kind}-${i}`,
      patient: `${first} ${last}`,
      phone,
      treatment: treatments[i % treatments.length],
      value,
      stage: "queued",
    };
  });
}

export function NewCampaignWizard({ open, onOpenChange, initialKind }: Props) {
  const [step, setStep] = useState(0);
  const [source, setSource] = useState<CampaignSource | null>(initialKind ? "hint" : null);
  const [hint, setHint] = useState<CampaignHint | null>(
    initialKind ? (campaignHints.find((h) => h.kind === initialKind) ?? null) : null,
  );
  const [csvResult, setCsvResult] = useState<ParsedCsvResult | null>(null);
  const [name, setName] = useState("");
  const [minAmount, setMinAmount] = useState("200000");
  const [branch, setBranch] = useState("all");
  const [firstMessage, setFirstMessage] = useState(
    "Hola {nombre}, te escribimos de Clínica por tu {tratamiento}. ¿Coordinamos esta semana?",
  );
  const [enableFollowUp, setEnableFollowUp] = useState(true);
  const [perHour, setPerHour] = useState("30");
  const [scheduleFrom, setScheduleFrom] = useState("10:00");
  const [scheduleTo, setScheduleTo] = useState("19:00");
  const [excluded, setExcluded] = useState<Set<string>>(new Set());

  // Audiencia derivada según origen
  const audience = useMemo<CampaignAudienceMember[]>(() => {
    if (source === "csv") return csvResult?.rows ?? [];
    if (source === "hint" && hint) return buildHintAudience(hint);
    return [];
  }, [source, csvResult, hint]);

  const includedCount = audience.length - excluded.size;

  const reset = () => {
    setStep(0);
    setSource(initialKind ? "hint" : null);
    setHint(initialKind ? (campaignHints.find((h) => h.kind === initialKind) ?? null) : null);
    setCsvResult(null);
    setName("");
    setExcluded(new Set());
  };

  const handleClose = (next: boolean) => {
    onOpenChange(next);
    if (!next) setTimeout(reset, 200);
  };

  const canNext =
    (step === 0 && ((source === "hint" && !!hint) || (source === "csv" && !!csvResult))) ||
    (step === 1 && name.trim().length > 2) ||
    step === 2 ||
    step === 3;

  const launch = (asDraft = false) => {
    handleClose(false);
    toast.success(asDraft ? "Campaña guardada como borrador" : "Campaña lanzada (demo)", {
      description: `${name || hint?.title || csvResult?.fileName} · ${formatNumber(includedCount)} ${pluralize(includedCount, "cliente", "clientes")}${excluded.size > 0 ? ` (${excluded.size} ${pluralize(excluded.size, "excluido", "excluidos")})` : ""}`,
    });
  };

  const toggleOne = (id: string) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkToggle = (ids: string[], action: "include" | "exclude") => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (action === "include") ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const onPickHint = (h: CampaignHint) => {
    setHint(h);
    if (!name) setName(`${h.title} ${new Date().toLocaleString("es-CL", { month: "short" })}`);
  };

  const onPickCsv = (result: ParsedCsvResult | null) => {
    setCsvResult(result);
    if (result && !name) {
      const cleaned = result.fileName.replace(/\.csv$/i, "").replace(/[-_]/g, " ");
      setName(`Lista propia · ${cleaned}`.slice(0, 60));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-full sm:max-w-2xl p-0 gap-0 max-h-[90dvh] sm:max-h-[85dvh] flex flex-col">
        <DialogHeader className="px-4 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4 border-b shrink-0">
          <DialogTitle className="text-base">Nueva campaña de recuperación</DialogTitle>
          <DialogDescription className="text-xs">
            Paso {step + 1} de {STEP_LABELS.length} · {STEP_LABELS[step]}
          </DialogDescription>
          <div className="flex items-center gap-1.5 mt-2">
            {STEP_LABELS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i <= step ? "bg-primary" : "bg-muted",
                )}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1 min-h-0">
          {/* Paso 1 — origen */}
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                ¿De dónde sale la audiencia de esta campaña?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSource("hint")}
                  className={cn(
                    "rounded-xl border p-4 text-left transition flex items-start gap-3",
                    source === "hint"
                      ? "border-primary ring-2 ring-primary/20 bg-primary-soft/30"
                      : "hover:border-primary/40 hover:bg-muted/30",
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                      source === "hint"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Sugerencia de la IA</div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Elige un segmento ya detectado en tu CRM (presupuestos, inactivos, etc.)
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSource("csv")}
                  className={cn(
                    "rounded-xl border p-4 text-left transition flex items-start gap-3",
                    source === "csv"
                      ? "border-primary ring-2 ring-primary/20 bg-primary-soft/30"
                      : "hover:border-primary/40 hover:bg-muted/30",
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                      source === "csv"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Subir mi lista (CSV)</div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Carga tu propio listado de clientes con nombre y teléfono.
                    </p>
                  </div>
                </button>
              </div>

              {source === "hint" && (
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Elige una sugerencia
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {campaignHints.map((h) => {
                      const Icon = CAMPAIGN_KIND_ICON[h.kind];
                      const active = hint?.kind === h.kind;
                      return (
                        <button
                          key={h.kind}
                          type="button"
                          onClick={() => onPickHint(h)}
                          className={cn(
                            "flex items-start gap-3 rounded-xl border p-3 text-left transition",
                            active
                              ? "border-primary ring-2 ring-primary/20 bg-primary-soft/30"
                              : "hover:border-primary/40 hover:bg-muted/40",
                          )}
                        >
                          <div
                            className={cn(
                              "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                              active
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold">{h.title}</div>
                            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                              {h.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                              {h.audienceSize > 0 && (
                                <span className="text-muted-foreground">
                                  {formatNumber(h.audienceSize)}{" "}
                                  {pluralize(h.audienceSize, "cliente", "clientes")}
                                </span>
                              )}
                              {h.estimatedValue > 0 && (
                                <span className="text-success font-medium">
                                  ~ {formatCLP(h.estimatedValue)}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {source === "csv" && (
                <div className="pt-2">
                  <CsvImport value={csvResult} onChange={onPickCsv} />
                </div>
              )}
            </div>
          )}

          {/* Paso 2 — audiencia */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Nombre de la campaña</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Presupuestos pendientes abril"
                />
              </div>

              {source === "hint" && hint && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Monto mínimo (CLP)</Label>
                      <Input
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        inputMode="numeric"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Sucursal</Label>
                      <Select value={branch} onValueChange={setBranch}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="providencia">Providencia</SelectItem>
                          <SelectItem value="las-condes">Las Condes</SelectItem>
                          <SelectItem value="nunoa">Ñuñoa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="rounded-xl border bg-primary-soft/30 p-4 space-y-1">
                    <div className="text-[11px] uppercase tracking-wider text-primary font-semibold">
                      Audiencia estimada
                    </div>
                    <div className="text-2xl font-semibold tabular-nums">
                      {formatNumber(audience.length)}{" "}
                      {pluralize(audience.length, "cliente", "clientes")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Valor potencial total ~{" "}
                      <span className="text-success font-medium">
                        {formatCLP(hint.estimatedValue)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Podrás revisar y desmarcar clientes uno por uno antes de lanzar.
                  </p>
                </>
              )}

              {source === "csv" && csvResult && (
                <div className="rounded-xl border bg-primary-soft/30 p-4 space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-primary font-semibold">
                    Lista cargada
                  </div>
                  <div className="text-sm font-medium truncate">{csvResult.fileName}</div>
                  <div className="text-2xl font-semibold tabular-nums">
                    {formatNumber(csvResult.rows.length)}{" "}
                    {pluralize(csvResult.rows.length, "contacto", "contactos")}
                  </div>
                  {(csvResult.invalidCount > 0 || csvResult.duplicateCount > 0) && (
                    <div className="text-[11px] text-muted-foreground">
                      Descartados: {csvResult.invalidCount} sin teléfono ·{" "}
                      {csvResult.duplicateCount} duplicados
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Paso 3 — mensaje + ritmo */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Primer mensaje</Label>
                <Textarea
                  value={firstMessage}
                  onChange={(e) => setFirstMessage(e.target.value)}
                  rows={4}
                  className="text-sm"
                />
                <p className="text-[11px] text-muted-foreground">
                  Variables: <code className="font-mono text-foreground">{"{nombre}"}</code>{" "}
                  <code className="font-mono text-foreground">{"{tratamiento}"}</code>
                </p>
              </div>

              <div className="rounded-lg border bg-bubble-ai p-3 text-sm text-bubble-ai-foreground max-w-sm">
                {firstMessage
                  .replace("{nombre}", audience[0]?.patient?.split(" ")[0] ?? "María")
                  .replace(
                    "{tratamiento}",
                    (audience[0]?.treatment ?? hint?.title ?? "tratamiento").toLowerCase(),
                  )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Desde</Label>
                  <Input
                    type="time"
                    value={scheduleFrom}
                    onChange={(e) => setScheduleFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Hasta</Label>
                  <Input
                    type="time"
                    value={scheduleTo}
                    onChange={(e) => setScheduleTo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Por hora</Label>
                  <Input
                    value={perHour}
                    onChange={(e) => setPerHour(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-sm font-medium">Seguimiento automático</div>
                  <div className="text-[11px] text-muted-foreground">
                    Reintenta a las 48h y 5 días si no responde.
                  </div>
                </div>
                <Switch checked={enableFollowUp} onCheckedChange={setEnableFollowUp} />
              </div>

              <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1">
                <div>
                  <span className="text-muted-foreground">Origen:</span>{" "}
                  <span className="font-medium">
                    {source === "csv"
                      ? `CSV · ${csvResult?.fileName}`
                      : hint
                        ? CAMPAIGN_KIND_LABEL[hint.kind]
                        : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Audiencia:</span>{" "}
                  <span className="font-medium">
                    {formatNumber(audience.length)}{" "}
                    {pluralize(audience.length, "cliente", "clientes")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Ritmo:</span>{" "}
                  <span className="font-medium">
                    {perHour}/hora · {scheduleFrom}–{scheduleTo} L–S
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Paso 4 — revisar lista */}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Todos los clientes están seleccionados por defecto. Desmarca los que no quieras
                contactar.
              </p>
              <AudienceReviewTable
                contacts={audience}
                excluded={excluded}
                onToggle={toggleOne}
                onBulk={bulkToggle}
              />
            </div>
          )}
        </div>

        <DialogFooter className="px-4 sm:px-6 py-3 sm:py-4 border-t flex-row justify-between gap-2 shrink-0">
          <Button
            variant="ghost"
            onClick={() => (step === 0 ? handleClose(false) : setStep(step - 1))}
          >
            {step === 0 ? (
              "Cancelar"
            ) : (
              <>
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Atrás
              </>
            )}
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canNext}>
              Siguiente <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => launch(true)}>
                Guardar borrador
              </Button>
              <Button onClick={() => launch(false)} disabled={includedCount === 0}>
                <Send className="h-4 w-4 mr-1.5" /> Lanzar a {formatNumber(includedCount)}{" "}
                {pluralize(includedCount, "cliente", "clientes")}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
