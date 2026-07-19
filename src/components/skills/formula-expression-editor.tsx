import { useCallback, useMemo, useRef, type ReactNode } from "react";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { Label } from "@/components/ui/label";
import {
  FORMULA_FUNCTION_TOKENS,
  FORMULA_OPERATOR_TOKENS,
  formulaExpressionHasVar,
} from "@/lib/skills";
import { cn } from "@/lib/utils";
import { Code, FunctionSquare, HelpCircle, Variable } from "lucide-react";

type FormulaExpressionEditorProps = {
  value: string;
  onChange: (next: string) => void;
  variables: string[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  emptyVariablesHint?: string;
  /** Tema claro/oscuro del editor */
  dark?: boolean;
};

type InsertToken = {
  insert: string;
  cursorOffset?: number;
};

export function FormulaExpressionEditor({
  value,
  onChange,
  variables,
  label = "Expresión matemática",
  placeholder = "# Función: entradas → resultado\nflow_l_s * hours * 3.6",
  className,
  emptyVariablesHint = "Definí variables para poder insertarlas acá.",
  dark = true,
}: FormulaExpressionEditorProps) {
  const ref = useRef<ReactCodeMirrorRef>(null);

  const insertAtCursor = useCallback(
    (token: InsertToken) => {
      const view = ref.current?.view;
      if (!view) {
        onChange(`${value}${token.insert}`);
        return;
      }
      const { from, to } = view.state.selection.main;
      const insert = token.insert;
      view.dispatch({
        changes: { from, to, insert },
        selection: {
          anchor: from + (token.cursorOffset ?? insert.length),
        },
      });
      onChange(view.state.doc.toString());
      view.focus();
    },
    [onChange, value],
  );

  const insertVariable = (varName: string) => {
    if (formulaExpressionHasVar(value, varName)) return;
    insertAtCursor({ insert: varName });
  };

  const extensions = useMemo(
    () => [
      javascript(),
      EditorView.lineWrapping,
      EditorView.theme({
        "&": { fontSize: "13px" },
        ".cm-content": { minHeight: "140px", padding: "10px 0" },
        ".cm-scroller": { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" },
      }),
    ],
    [],
  );

  const Chip = ({
    children,
    onClick,
    disabled,
    tone = "muted",
    title,
  }: {
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
    tone?: "muted" | "primary" | "used";
    title?: string;
  }) => (
    <button
      type="button"
      disabled={disabled}
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono transition-all duration-150 border shadow-sm",
        tone === "primary" &&
          "border-primary/25 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40",
        tone === "muted" &&
          "border-border bg-muted/40 text-muted-foreground hover:bg-muted disabled:opacity-40",
        tone === "used" &&
          "border-border/40 bg-muted/20 text-muted-foreground/40 cursor-not-allowed",
      )}
    >
      {children}
    </button>
  );

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <div className="flex items-center gap-1.5">
          <FunctionSquare className="h-3.5 w-3.5 text-primary" />
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </Label>
        </div>
      )}

      <div className="rounded-md border border-border/70 overflow-hidden focus-within:border-primary/45 focus-within:ring-1 focus-within:ring-primary/20 transition-colors">
        <div className="flex flex-wrap items-center gap-1 border-b border-border/50 bg-muted/20 px-2 py-1.5 select-none">
          <span className="text-[9px] text-muted-foreground/70 mr-1 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Code className="h-3 w-3" /> Ops
          </span>
          {FORMULA_OPERATOR_TOKENS.map((op) => (
            <Chip
              key={op.label}
              onClick={() =>
                insertAtCursor({
                  insert: op.insert,
                  cursorOffset: "cursorOffset" in op ? op.cursorOffset : undefined,
                })
              }
            >
              {op.label}
            </Chip>
          ))}
          <span className="mx-1 h-3 w-px bg-border/80" aria-hidden />
          <span className="text-[9px] text-muted-foreground/70 mr-1 font-semibold uppercase tracking-wider">
            Funciones
          </span>
          {FORMULA_FUNCTION_TOKENS.map((fn) => (
            <Chip
              key={fn.label}
              onClick={() =>
                insertAtCursor({
                  insert: fn.insert,
                  cursorOffset: fn.cursorOffset,
                })
              }
            >
              {fn.label}
            </Chip>
          ))}
        </div>

        <CodeMirror
          ref={ref}
          value={value}
          height="160px"
          theme={dark ? oneDark : "light"}
          extensions={extensions}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: true,
            bracketMatching: true,
          }}
          placeholder={placeholder}
          onChange={(v) => onChange(v)}
          className="text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          <Variable className="h-3 w-3 text-muted-foreground/70" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Variables de la función
          </span>
        </div>
        {variables.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {variables.map((varName) => {
              const used = formulaExpressionHasVar(value, varName);
              return (
                <Chip
                  key={varName}
                  tone={used ? "used" : "primary"}
                  disabled={used}
                  title={used ? "Ya está en la expresión" : `Insertar ${varName}`}
                  onClick={() => insertVariable(varName)}
                >
                  {varName}
                  {used ? " ✓" : ""}
                </Chip>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground/60 italic flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5 opacity-50" />
            {emptyVariablesHint}
          </p>
        )}
      </div>
    </div>
  );
}
