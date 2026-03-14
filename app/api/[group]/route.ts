import { NextResponse } from "next/server";

import { apiGroups } from "@/lib/api-groups";
import { isCurrentUserAdmin } from "@/lib/auth";
import {
  getAdvancedFeatureSnapshot,
  getComplianceSnapshot,
  getConnectSnapshot,
  getDashboardSnapshot,
  getEnergySnapshot,
  getHistoricalSnapshot,
  getHandoverSnapshot,
  getInventorySnapshot,
  getInnovationIdeaSnapshot,
  getKpiSnapshot,
  getOperatorSnapshot,
  getOptimizationSnapshot,
  getPlanningSnapshot,
  getSitesSnapshot,
  getSpcSnapshot,
} from "@/lib/data";

type RouteContext = {
  params: Promise<{
    group: string;
  }>;
};

const groupSet = new Set(apiGroups.map((group) => group.replace("/", "")));
const adminOnlyGroups = new Set(["integration", "optimization", "compliance", "advanced", "innovation"]);

type SnapshotSource = "supabase" | "demo";

function resolveSource(...sources: SnapshotSource[]) {
  const distinct = new Set(sources);
  if (distinct.size === 1) {
    return sources[0];
  }

  return "mixed" as const;
}

export async function GET(_: Request, context: RouteContext) {
  const { group } = await context.params;

  if (!groupSet.has(group)) {
    return NextResponse.json({ error: "Unknown API group" }, { status: 404 });
  }

  if (adminOnlyGroups.has(group) && !(await isCurrentUserAdmin())) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const [
    dashboard,
    connectors,
    sites,
    kpis,
    historical,
    planning,
    energy,
    inventory,
    operators,
    optimization,
    compliance,
    handover,
    spc,
    advanced,
    innovation,
  ] = await Promise.all([
    getDashboardSnapshot(),
    getConnectSnapshot(),
    getSitesSnapshot(),
    getKpiSnapshot(),
    getHistoricalSnapshot(),
    getPlanningSnapshot(),
    getEnergySnapshot(),
    getInventorySnapshot(),
    getOperatorSnapshot(),
    getOptimizationSnapshot(),
    getComplianceSnapshot(),
    getHandoverSnapshot(),
    getSpcSnapshot(),
    getAdvancedFeatureSnapshot(),
    getInnovationIdeaSnapshot(),
  ]);

  switch (group) {
    case "auth":
      return NextResponse.json({
        data: {
          supported: ["email_password"],
          roles: ["admin", "plant_manager", "operator"],
          confirmPath: "/auth/confirm",
        },
      });
    case "equipment":
      return NextResponse.json({ source: dashboard.source, data: dashboard.equipment });
    case "production-lines":
      return NextResponse.json({ source: dashboard.source, data: dashboard.productionLines });
    case "alerts":
      return NextResponse.json({ source: dashboard.source, data: dashboard.alerts });
    case "maintenance":
    case "predictions":
      return NextResponse.json({ source: dashboard.source, data: dashboard.maintenance });
    case "quality":
      return NextResponse.json({ source: dashboard.source, data: dashboard.qualityEvents });
    case "digital-twin":
      return NextResponse.json({
        source: dashboard.source,
        data: dashboard.equipment.map((item) => ({
          equipmentId: item.id,
          name: item.name,
          state: item.digitalTwinState,
          healthScore: item.healthScore,
          utilization: item.utilization,
          status: item.status,
        })),
      });
    case "analytics":
      return NextResponse.json({
        source: resolveSource(dashboard.source, historical.source, spc.source),
        data: {
          summary: dashboard.summary,
          oee: dashboard.productionLines.map((line) => ({
            lineId: line.id,
            lineName: line.name,
            oee: line.oee,
          })),
          history: historical.points,
          spcSamples: spc.samples,
        },
      });
    case "integration":
      return NextResponse.json({ source: connectors.source, data: connectors.connectors });
    case "energy":
      return NextResponse.json({ source: energy.source, data: energy.records });
    case "operators":
      return NextResponse.json({ source: operators.source, data: operators.operators });
    case "inventory":
      return NextResponse.json({ source: inventory.source, data: inventory.items });
    case "optimization":
      return NextResponse.json({
        source: resolveSource(optimization.source, planning.source),
        data: {
          recommendations: optimization.recommendations,
          plans: planning.plans,
        },
      });
    case "compliance":
      return NextResponse.json({ source: compliance.source, data: compliance.entries });
    case "reports":
      return NextResponse.json({
        source: resolveSource(sites.source, kpis.source, handover.source, compliance.source),
        data: {
          siteSummary: sites.sites,
          kpis: kpis.kpis,
          handovers: handover.reports,
          compliance: compliance.entries,
          generatedAt: new Date().toISOString(),
        },
      });
    case "advanced":
      return NextResponse.json({ source: advanced.source, data: advanced.modules });
    case "innovation":
      return NextResponse.json({ source: innovation.source, data: innovation.ideas });
    case "sensors":
      return NextResponse.json({
        source: resolveSource(dashboard.source, connectors.source),
        data: dashboard.equipment.flatMap((item) => [
          {
            id: `${item.id}-temperature`,
            equipmentId: item.id,
            name: `${item.name} Temperature`,
            status: item.status === "maintenance" ? "offline" : "healthy",
            protocol: "OPC-UA",
            unit: "degC",
            value: Number((55 + item.energyKw / 8).toFixed(1)),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `${item.id}-vibration`,
            equipmentId: item.id,
            name: `${item.name} Vibration`,
            status: item.status === "running" ? "healthy" : "degraded",
            protocol: "MQTT",
            unit: "mm/s",
            value: Number((1 + (100 - item.healthScore) / 25).toFixed(2)),
            updatedAt: new Date().toISOString(),
          },
        ]),
      });
    case "measurements":
      return NextResponse.json({
        source: resolveSource(historical.source, energy.source),
        data: [
          ...historical.points.map((point) => ({
            id: point.id,
            assetId: point.lineId,
            metric: point.metric,
            value: point.value,
            unit: point.metric === "throughput" ? "units/hr" : "%",
            recordedAt: point.recordedAt,
          })),
          ...energy.records.map((record) => ({
            id: record.id,
            assetId: record.lineId,
            metric: "energy_kwh",
            value: record.kwh,
            unit: "kWh",
            recordedAt: record.recordedAt,
          })),
        ].sort((a, b) => (a.recordedAt > b.recordedAt ? -1 : 1)),
      });
    default:
      return NextResponse.json({ error: "Unknown API group" }, { status: 404 });
  }
}
