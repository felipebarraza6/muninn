import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Preview + file picker para logo / ícono / portada. */
export function ThemeAssetField({
  label,
  hint,
  previewUrl,
  file,
  onFile,
}: {
  label: string;
  hint?: string;
  previewUrl: string;
  file: File | null;
  onFile: (file: File | null) => void;
}) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [previewUrl, file]);

  useEffect(() => {
    if (!file) {
      setLocalPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const src = localPreview || (!broken ? previewUrl : "") || null;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40">
          {src ? (
            <img
              src={src}
              alt=""
              className="h-full w-full object-contain"
              onError={() => setBroken(true)}
            />
          ) : (
            <span className="text-[10px] text-muted-foreground text-center px-1">
              {broken ? "No carga" : "Sin imagen"}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <Input
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp,image/x-icon,.ico"
            className="cursor-pointer text-xs file:mr-2"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
          {file && (
            <button
              type="button"
              className="text-[11px] text-muted-foreground underline-offset-2 hover:underline"
              onClick={() => onFile(null)}
            >
              Quitar selección ({file.name})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
