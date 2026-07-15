import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { refreshBranchThemeForAppearance } from "@/lib/applyBranchTheme";
import {
  applyAppearanceClass,
  getStoredThemePreference,
  persistThemePreference,
  resolveAppearance,
  subscribeSystemAppearance,
  type ResolvedAppearance,
  type ThemePreference,
} from "@/lib/theme";

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ResolvedAppearance;
  setPreference: (preference: ThemePreference) => void;
  cyclePreference: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const CYCLE: ThemePreference[] = ["light", "dark", "system"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    getStoredThemePreference(),
  );
  const [resolved, setResolved] = useState<ResolvedAppearance>(() =>
    resolveAppearance(getStoredThemePreference()),
  );

  const apply = useCallback((next: ThemePreference) => {
    const appearance = applyAppearanceClass(next);
    setResolved(appearance);
    refreshBranchThemeForAppearance();
    return appearance;
  }, []);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      setPreferenceState(next);
      persistThemePreference(next);
      apply(next);
    },
    [apply],
  );

  const cyclePreference = useCallback(() => {
    setPreferenceState((prev) => {
      const idx = CYCLE.indexOf(prev);
      const next = CYCLE[(idx + 1) % CYCLE.length];
      persistThemePreference(next);
      apply(next);
      return next;
    });
  }, [apply]);

  useEffect(() => {
    apply(preference);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- bootstrap once

  useEffect(() => {
    if (preference !== "system") return;
    return subscribeSystemAppearance(() => {
      apply("system");
    });
  }, [preference, apply]);

  const value = useMemo(
    () => ({ preference, resolved, setPreference, cyclePreference }),
    [preference, resolved, setPreference, cyclePreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }
  return ctx;
}
