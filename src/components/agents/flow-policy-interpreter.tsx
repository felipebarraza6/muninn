import { useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Shield,
  Clock,
  UserCheck,
  MessageSquare,
  BookOpen,
  Settings2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FlowPolicyRaw = Record<string, unknown>;

type Rule = {
  id: string;
  label: string;
  description: string;
  active: boolean;
  icon: LucideIcon;
  detail?: string;
};

function asRecord(v: unknown): Record<string, unknown> {
  if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
  return {};
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function asBool(v: unknown): boolean {
  return v === true || v === "true";
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function interpretRules(fp: FlowPolicyRaw): Rule[] {
  const rules: Rule[] = [];

  const arp = asRecord(fp.availability_requires_professional);
  if (arp) {
    const enabled = asBool(arp.enabled);
    rules.push({
      id: "availability_requires_professional",
      label: "Profesional requerido antes de disponibilidad",
      description: enabled
        ? "El agente NO lista horarios sin antes preguntar por profesional."
        : "El agente puede listar horarios sin preguntar por profesional.",
      active: enabled,
      icon: UserCheck,
      detail: enabled ? String(arp.hint || "").trim() || undefined : undefined,
    });
  }

  const blocklist = asArray(fp.professional_blocklist);
  if (blocklist.length > 0) {
    rules.push({
      id: "professional_blocklist",
      label: "Bloqueo de palabras clave",
      description: `Bloquea ${blocklist.length} palabras genéricas sin contexto (ej: ${blocklist.slice(0, 3).join(", ")}...).`,
      active: blocklist.length > 0,
      icon: Shield,
      detail: blocklist.join(", "),
    });
  }

  const npi = asArray(fp.new_patient_intent_patterns);
  if (npi.length > 0) {
    rules.push({
      id: "new_patient_intent",
      label: "Detección de nuevo paciente",
      description: `Detecta ${npi.length} patrones cuando quieren agendar para otra persona (hijos, familiar, etc.).`,
      active: npi.length > 0,
      icon: MessageSquare,
    });
  }

  const lifecycle = asRecord(fp.lifecycle);
  if (lifecycle) {
    const timeout = asNumber(lifecycle.inactivity_timeout_minutes);
    const reset = asBool(lifecycle.reset_on_inactivity);
    rules.push({
      id: "lifecycle",
      label: "Reset por inactividad",
      description:
        reset && timeout != null
          ? `Se resetea después de ${timeout} minutos sin actividad.`
          : reset
            ? "Se resetea por inactividad (timeout no configurado)."
            : "No se resetea por inactividad.",
      active: reset,
      icon: Clock,
      detail: timeout != null ? `${timeout} min` : undefined,
    });
  }

  const consentSlots = asArray(fp.consent_slot_names);
  const consentSufficient = asBool(fp.consent_patient_data_sufficient);
  if (consentSlots.length > 0) {
    rules.push({
      id: "consent",
      label: "Consentimiento requerido",
      description: consentSufficient
        ? `Requiere consentimiento explícito antes de crear cita (${consentSlots.join(", ")}).`
        : `Usa slots de consentimiento: ${consentSlots.join(", ")}.`,
      active: consentSlots.length > 0,
      icon: CheckCircle2,
    });
  }

  const allowedHours = asArray(fp.allowed_hours);
  if (allowedHours.length === 2) {
    const from = allowedHours[0];
    const to = allowedHours[1];
    rules.push({
      id: "allowed_hours",
      label: "Horario permitido",
      description: `Horario de atención: ${String(from).padStart(2, "0")}:00 - ${String(to).padStart(2, "0")}:00.`,
      active: true,
      icon: Clock,
    });
  }

  const reasonAliases = asRecord(fp.reason_aliases);
  const aliasCount = Object.keys(reasonAliases).length;
  if (aliasCount > 0) {
    const examples = Object.entries(reasonAliases).slice(0, 3);
    rules.push({
      id: "reason_aliases",
      label: "Normalización de motivos",
      description: `${aliasCount} aliases de motivos configurados. Ej: ${examples.map(([k, v]) => `"${k}" → "${v}"`).join(", ")}.`,
      active: aliasCount > 0,
      icon: Settings2,
    });
  }

  const normalize = asBool(fp.normalize_booking_params);
  if (fp.normalize_booking_params !== undefined) {
    rules.push({
      id: "normalize_booking",
      label: "Normalización de parámetros",
      description: normalize
        ? "RUT, teléfono, hora y servicio se normalizan automáticamente."
        : "Parámetros de reserva sin normalización automática.",
      active: normalize,
      icon: Settings2,
    });
  }

  const fuzzyMaxDist = asNumber(fp.fuzzy_max_distance);
  if (fuzzyMaxDist !== null) {
    rules.push({
      id: "fuzzy_matching",
      label: "Fuzzy matching",
      description: `Distancia máxima: ${fuzzyMaxDist}, token mínimo: ${fp.fuzzy_min_token_length ?? "?"}, diferencia de largo: ${fp.fuzzy_max_length_diff ?? "?"}.`,
      active: fuzzyMaxDist > 0,
      icon: Zap,
    });
  }

  const linguisticStyle = fp.linguistic_style;
  if (typeof linguisticStyle === "string" && linguisticStyle.trim()) {
    rules.push({
      id: "linguistic_style",
      label: "Estilo lingüístico",
      description: "Estilo de conversación configurado (variedad, tono, frases).",
      active: true,
      icon: BookOpen,
      detail: linguisticStyle.trim(),
    });
  }

  const bookingSkill = fp.booking_skill;
  const availSkills = asArray(fp.availability_skills);
  if (typeof bookingSkill === "string" || availSkills.length > 0) {
    rules.push({
      id: "skill_routing",
      label: "Routing de skills",
      description: [
        bookingSkill ? `Booking: ${bookingSkill}` : "",
        availSkills.length > 0 ? `Disponibilidad: ${availSkills.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join(" · "),
      active: true,
      icon: Zap,
    });
  }

  const slots = asRecord(fp.slots);
  const slotKeys = Object.keys(slots);
  if (slotKeys.length > 0) {
    rules.push({
      id: "slots",
      label: `${slotKeys.length} slots de captura`,
      description: slotKeys.join(", "),
      active: true,
      icon: Settings2,
    });
  }

  const skills = asRecord(fp.skills);
  const skillKeys = Object.keys(skills);
  if (skillKeys.length > 0) {
    const withRequires = skillKeys.filter((k) => {
      const s = asRecord(skills[k]);
      return asArray(s.requires).length > 0;
    });
    rules.push({
      id: "skill_rules",
      label: `${skillKeys.length} skills con reglas`,
      description: `${withRequires.length} requieren parámetros previos.`,
      active: true,
      icon: Zap,
    });
  }

  const dashStats = asArray(fp.dashboard_stats);
  if (dashStats.length > 0) {
    rules.push({
      id: "dashboard_stats",
      label: `${dashStats.length} widgets de dashboard`,
      description: dashStats
        .map((d: unknown) => {
          const r = asRecord(d);
          return String(r.label || r.key || "?");
        })
        .join(", "),
      active: true,
      icon: Settings2,
    });
  }

  return rules;
}

function RuleCard({ rule }: { rule: Rule }) {
  const Icon = rule.icon;
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-3 transition-colors",
        rule.active ? "border-primary/20 bg-primary/5" : "border-border/40 bg-muted/20",
      )}
    >
      <div className="mt-0.5 shrink-0">
        {rule.active ? (
          <CheckCircle2 className="h-4 w-4 text-primary" />
        ) : (
          <XCircle className="h-4 w-4 text-muted-foreground/50" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{rule.label}</span>
          <Icon className="h-3 w-3 text-muted-foreground" />
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{rule.description}</p>
        {rule.detail && (
          <p className="mt-1 text-[11px] font-mono text-muted-foreground/70 leading-relaxed whitespace-pre-wrap">
            {rule.detail}
          </p>
        )}
      </div>
    </div>
  );
}

interface FlowPolicyInterpreterProps {
  flowPolicy?: FlowPolicyRaw | null;
  className?: string;
}

export function FlowPolicyInterpreter({ flowPolicy, className }: FlowPolicyInterpreterProps) {
  const rules = useMemo(() => {
    if (!flowPolicy || typeof flowPolicy !== "object" || Array.isArray(flowPolicy)) return [];
    return interpretRules(flowPolicy);
  }, [flowPolicy]);

  if (rules.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Sin reglas de flujo configuradas.
        </CardContent>
      </Card>
    );
  }

  const activeCount = rules.filter((r) => r.active).length;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Reglas de Conversación</CardTitle>
          <Badge
            variant={activeCount === rules.length ? "default" : "secondary"}
            className="text-[10px]"
          >
            {activeCount}/{rules.length} activas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {rules.map((rule) => (
          <RuleCard key={rule.id} rule={rule} />
        ))}
      </CardContent>
    </Card>
  );
}
