import { useEffect, useMemo, useRef, useState } from "react";
import { Wrench } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type SkillCommandOption = {
  id: string;
  name: string;
  slug: string;
};

/** Detecta query activa tras `/` (inicio o espacio previo). */
export function getSlashSkillQuery(
  value: string,
  cursor = value.length,
): { start: number; query: string } | null {
  const before = value.slice(0, cursor);
  const match = before.match(/(^|[\s])\/([^\s]*)$/);
  if (!match) return null;
  const slashIndex = before.lastIndexOf("/");
  return { start: slashIndex, query: match[2] ?? "" };
}

export function insertSlashSkill(
  value: string,
  start: number,
  cursor: number,
  slug: string,
): { next: string; cursor: number } {
  const token = `/${slug} `;
  const next = `${value.slice(0, start)}${token}${value.slice(cursor)}`;
  return { next, cursor: start + token.length };
}

/** Quita el `/query` incompleto del input al elegir una skill como tag. */
export function removeSlashQuery(
  value: string,
  start: number,
  cursor: number,
): { next: string; cursor: number } {
  const next = `${value.slice(0, start)}${value.slice(cursor)}`.replace(/\s{2,}/g, " ");
  const nextCursor = Math.min(start, next.length);
  return { next, cursor: nextCursor };
}

type ChatSkillCommandProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skills: SkillCommandOption[];
  query: string;
  onSelect: (skill: SkillCommandOption) => void;
  /** Ancla visual: el form/input wrapper. */
  children: React.ReactNode;
  className?: string;
};

/** Popover cmdk anclado al composer para `/skill`. */
export function ChatSkillCommand({
  open,
  onOpenChange,
  skills,
  query,
  onSelect,
  children,
  className,
}: ChatSkillCommandProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return skills.slice(0, 12);
    return skills
      .filter((s) => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q))
      .slice(0, 12);
  }, [skills, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open, filtered.length]);

  const handleKeyDownCapture = (e: React.KeyboardEvent) => {
    if (!open || !filtered.length) {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        onOpenChange(false);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filtered.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const skill = filtered[activeIndex] ?? filtered[0];
      if (skill) onSelect(skill);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>
        <div className={cn("relative w-full", className)} onKeyDownCapture={handleKeyDownCapture}>
          {children}
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        side="top"
        sideOffset={8}
        className="w-[min(100vw-2rem,22rem)] p-0 overflow-hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList ref={listRef} className="max-h-56">
            <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
              Sin skills que coincidan
            </CommandEmpty>
            <CommandGroup heading="Skills del agente">
              {filtered.map((skill, i) => (
                <CommandItem
                  key={skill.id}
                  value={`${skill.slug} ${skill.name}`}
                  onSelect={() => onSelect(skill)}
                  data-highlighted={i === activeIndex ? "" : undefined}
                  className={cn(
                    "gap-2 cursor-pointer",
                    i === activeIndex && "bg-accent text-accent-foreground",
                  )}
                >
                  <Wrench className="h-3.5 w-3.5 shrink-0 text-primary/80" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{skill.name}</p>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">
                      /{skill.slug}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
