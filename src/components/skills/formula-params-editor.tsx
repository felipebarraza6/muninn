import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getDuplicateFormulaVarIndexes,
  JSON_SCHEMA_TYPE_HINT,
  JSON_SCHEMA_TYPE_LABEL,
  type FormulaParamDraft,
} from "@/lib/skills";

type FormulaParamsEditorProps = {
  value: FormulaParamDraft[];
  onChange: (next: FormulaParamDraft[]) => void;
};

export function FormulaParamsEditor({ value, onChange }: FormulaParamsEditorProps) {
  const duplicateIndexes = getDuplicateFormulaVarIndexes(value);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <Label>Variables</Label>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Definí las entradas antes de armar la expresión en Trabajar.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() =>
            onChange([...value, { name: "", type: "number", description: "", required: true }])
          }
        >
          <Plus className="h-3 w-3 mr-1" /> Agregar
        </Button>
      </div>

      <div className="space-y-1.5">
        {value.map((p, idx) => (
          <div key={idx} className="flex flex-wrap items-center gap-1.5">
            <Input
              value={p.name}
              onChange={(e) =>
                onChange(
                  value.map((row, i) => (i === idx ? { ...row, name: e.target.value } : row)),
                )
              }
              placeholder="nombre"
              className={`h-8 font-mono text-xs min-w-[7rem] flex-1 ${
                duplicateIndexes.has(idx) ? "border-destructive" : ""
              }`}
              title={duplicateIndexes.has(idx) ? "Nombre duplicado" : JSON_SCHEMA_TYPE_HINT[p.type]}
            />
            <Select
              value={p.type}
              onValueChange={(v) =>
                onChange(
                  value.map((row, i) =>
                    i === idx ? { ...row, type: v as FormulaParamDraft["type"] } : row,
                  ),
                )
              }
            >
              <SelectTrigger className="h-8 w-[7rem] text-xs shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="number">{JSON_SCHEMA_TYPE_LABEL.number}</SelectItem>
                <SelectItem value="integer">{JSON_SCHEMA_TYPE_LABEL.integer}</SelectItem>
                <SelectItem value="string">{JSON_SCHEMA_TYPE_LABEL.string}</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={p.description}
              onChange={(e) =>
                onChange(
                  value.map((row, i) =>
                    i === idx ? { ...row, description: e.target.value } : row,
                  ),
                )
              }
              placeholder="desc. LLM"
              className="h-8 text-xs min-w-[8rem] flex-[1.2]"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive shrink-0"
              disabled={value.length <= 1}
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
              aria-label="Quitar variable"
            >
              ×
            </Button>
          </div>
        ))}
      </div>

      {duplicateIndexes.size > 0 && (
        <p className="text-[11px] text-destructive">Hay nombres de variable duplicados.</p>
      )}
    </div>
  );
}
