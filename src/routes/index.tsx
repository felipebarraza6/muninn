import type { ComponentType } from "react";
import {
  getHomeDashboardKind,
  type HomeDashboardKind,
} from "@/lib/authGuards";
import { PlatformHome } from "@/components/dashboard/platform-home";
import { OrganizationHome } from "@/components/dashboard/organization-home";
import { BusinessHome } from "@/components/dashboard/business-home";

const HOME_BY_KIND: Record<HomeDashboardKind, ComponentType> = {
  platform: PlatformHome,
  organization: OrganizationHome,
  business: BusinessHome,
};

/** Resumen `/` — elige dashboard según rol (plataforma / holding / negocio). */
export default function HomePage() {
  const kind = getHomeDashboardKind();
  const Home = HOME_BY_KIND[kind];
  return <Home />;
}
