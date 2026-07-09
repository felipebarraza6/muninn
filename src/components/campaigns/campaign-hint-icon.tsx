import {
  Banknote,
  UserPlus,
  CalendarX2,
  ClipboardCheck,
  Sparkles,
  Gift,
  Users,
  CalendarCheck,
  RotateCcw,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import type { CampaignKind } from "@/lib/mock-data";

export const CAMPAIGN_KIND_ICON: Record<CampaignKind, LucideIcon> = {
  budgets: Banknote,
  inactive: UserPlus,
  missed: CalendarX2,
  controls: ClipboardCheck,
  cleaning: Sparkles,
  evaluation: Gift,
  leads: Users,
  confirm: CalendarCheck,
  reschedule: RotateCcw,
  post: HeartHandshake,
};
