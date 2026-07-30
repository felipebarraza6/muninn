import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export function PromptEditor({ value, onChange, height = "180px" }: PromptEditorProps) {
  return (
    <div className="overflow-hidden rounded-md border border-border/60">
      <CodeMirror
        value={value}
        height={height}
        theme={oneDark}
        extensions={[markdown()]}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: true,
        }}
      />
    </div>
  );
}
