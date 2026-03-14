import {
  demoAdvancedModules,
  createDashboardSummary,
  demoAnomalies,
  demoCompliance,
  demoConnectors,
  demoData,
  demoEnergy,
  demoGenealogy,
  demoHistoricalPoints,
  demoInventory,
  demoInnovationIdeas,
  demoKpis,
  demoOperators,
  demoOptimizations,
  demoPlans,
  demoRootCauses,
  demoShiftReports,
  demoSites,
  demoSpc,
} from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import type {
  AdvancedFeatureModule,
  AdvancedFeatureSnapshot,
  Alert,
  AnomalyEvent,
  AnomalySnapshot,
  ComplianceEntry,
  ComplianceSnapshot,
  ConnectSnapshot,
  ConnectorStatus,
  CustomKpi,
  DashboardSnapshot,
  Equipment,
  EnergyRecord,
  EnergySnapshot,
  GenealogyRecord,
  GenealogySnapshot,
  HandoverSnapshot,
  HistoricalPoint,
  HistoricalSnapshot,
  InventoryItem,
  InventorySnapshot,
  InnovationIdea,
  InnovationIdeaSnapshot,
  KpiSnapshot,
  MaintenancePrediction,
  OperatorMetric,
  OperatorSnapshot,
  OptimizationRecommendation,
  OptimizationSnapshot,
  PlanningSnapshot,
  ProductionLine,
  ProductionPlanItem,
  QualityEvent,
  RootCauseCase,
  RootCauseSnapshot,
  ShiftHandoverReport,
  SitesSnapshot,
  SpcSample,
  SpcSnapshot,
} from "@/lib/types";

type SupabaseFacility = {
  id: string;
  name: string;
  location: string;
  active_shift: string;
};

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      source: "demo",
      ...demoData,
      summary: createDashboardSummary(demoData),
    };
  }

  try {
    const [
      facilityResult,
      linesResult,
      equipmentResult,
      alertsResult,
      maintenanceResult,
      qualityResult,
    ] = await Promise.all([
      supabase.from("facilities").select("*").limit(1).single(),
      supabase.from("production_lines").select("*").order("name"),
      supabase.from("equipment").select("*").order("name"),
      supabase.from("alerts").select("*").order("created_at", { ascending: false }).limit(8),
      supabase
        .from("maintenance_predictions")
        .select("*")
        .order("days_until_service", { ascending: true })
        .limit(8),
      supabase.from("quality_events").select("*").order("checked_at", { ascending: false }).limit(8),
    ]);

    if (
      facilityResult.error ||
      linesResult.error ||
      equipmentResult.error ||
      alertsResult.error ||
      maintenanceResult.error ||
      qualityResult.error ||
      !facilityResult.data ||
      !linesResult.data?.length ||
      !equipmentResult.data?.length
    ) {
      throw new Error("Supabase data unavailable");
    }

    const facility = mapFacility(facilityResult.data);
    const productionLines = (linesResult.data as Array<Record<string, unknown>>).map(mapLine);
    const equipment = (equipmentResult.data as Array<Record<string, unknown>>).map(mapEquipment);
    const alerts = (alertsResult.data as Array<Record<string, unknown>>).map(mapAlert);
    const maintenance = (maintenanceResult.data as Array<Record<string, unknown>>).map(mapMaintenance);
    const qualityEvents = (qualityResult.data as Array<Record<string, unknown>>).map(mapQualityEvent);

    return {
      source: "supabase",
      facility,
      productionLines,
      equipment,
      alerts,
      maintenance,
      qualityEvents,
      summary: createDashboardSummary({
        facility,
        productionLines,
        equipment,
        alerts,
        maintenance,
        qualityEvents,
      }),
    };
  } catch {
    return {
      source: "demo",
      ...demoData,
      summary: createDashboardSummary(demoData),
    };
  }
}

export async function getConnectSnapshot(): Promise<ConnectSnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      source: "demo",
      connectors: demoConnectors,
    };
  }

  try {
    const connectorResult = await supabase
      .from("connector_statuses")
      .select("*")
      .order("name", { ascending: true });

    if (connectorResult.error || !connectorResult.data?.length) {
      throw new Error("Connector data unavailable");
    }

    return {
      source: "supabase",
      connectors: (connectorResult.data as Array<Record<string, unknown>>).map(mapConnectorStatus),
    };
  } catch {
    return {
      source: "demo",
      connectors: demoConnectors,
    };
  }
}

export async function getSitesSnapshot(): Promise<SitesSnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      source: "demo",
      sites: demoSites,
    };
  }

  try {
    const [facilitiesResult, linesResult, equipmentResult, alertsResult] = await Promise.all([
      supabase.from("facilities").select("*").order("name", { ascending: true }),
      supabase.from("production_lines").select("*"),
      supabase.from("equipment").select("*"),
      supabase.from("alerts").select("*").neq("status", "resolved"),
    ]);

    if (
      facilitiesResult.error ||
      linesResult.error ||
      equipmentResult.error ||
      alertsResult.error ||
      !facilitiesResult.data?.length
    ) {
      throw new Error("Sites data unavailable");
    }

    const lineRows = (linesResult.data ?? []) as Array<Record<string, unknown>>;
    const equipmentRows = (equipmentResult.data ?? []) as Array<Record<string, unknown>>;
    const alertRows = (alertsResult.data ?? []) as Array<Record<string, unknown>>;

    const sites = facilitiesResult.data.map((facility) => {
      const facilityId = String(facility.id);
      const facilityLines = lineRows.filter((line) => String(line.facility_id) === facilityId);
      const facilityLineIds = new Set(facilityLines.map((line) => String(line.id)));
      const lineCount = facilityLines.length;
      const throughput = facilityLines.reduce((sum, line) => sum + Number(line.throughput), 0);
      const oee =
        lineCount > 0
          ? facilityLines.reduce((sum, line) => sum + Number(line.oee), 0) / lineCount
          : 0;

      const equipmentInFacility = equipmentRows.filter((equipment) =>
        facilityLineIds.has(String(equipment.line_id)),
      );
      const equipmentIds = new Set(equipmentInFacility.map((equipment) => String(equipment.id)));
      const openAlerts = alertRows.filter((alert) => equipmentIds.has(String(alert.equipment_id))).length;

      return {
        facilityId,
        facilityName: String(facility.name),
        location: String(facility.location),
        lineCount,
        oee,
        throughput,
        openAlerts,
        status: deriveSiteStatus(oee, openAlerts),
      };
    });

    return {
      source: "supabase",
      sites,
    };
  } catch {
    return {
      source: "demo",
      sites: demoSites,
    };
  }
}

export async function getKpiSnapshot(): Promise<KpiSnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      source: "demo",
      kpis: demoKpis,
    };
  }

  try {
    const kpiResult = await supabase.from("custom_kpis").select("*").order("name", { ascending: true });

    if (kpiResult.error || !kpiResult.data?.length) {
      throw new Error("KPI data unavailable");
    }

    return {
      source: "supabase",
      kpis: (kpiResult.data as Array<Record<string, unknown>>).map(mapKpi),
    };
  } catch {
    return {
      source: "demo",
      kpis: demoKpis,
    };
  }
}

export async function getAnomalySnapshot(): Promise<AnomalySnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return { source: "demo", anomalies: demoAnomalies };
  }

  try {
    const result = await supabase.from("anomaly_events").select("*").order("detected_at", { ascending: false });
    if (result.error || !result.data?.length) {
      throw new Error("Anomaly data unavailable");
    }
    return {
      source: "supabase",
      anomalies: (result.data as Array<Record<string, unknown>>).map(mapAnomaly),
    };
  } catch {
    return { source: "demo", anomalies: demoAnomalies };
  }
}

export async function getHistoricalSnapshot(): Promise<HistoricalSnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return { source: "demo", points: demoHistoricalPoints };
  }

  try {
    const result = await supabase
      .from("historical_points")
      .select("*")
      .order("recorded_at", { ascending: false })
      .limit(50);
    if (result.error || !result.data?.length) {
      throw new Error("Historical data unavailable");
    }
    return {
      source: "supabase",
      points: (result.data as Array<Record<string, unknown>>).map(mapHistoricalPoint),
    };
  } catch {
    return { source: "demo", points: demoHistoricalPoints };
  }
}

export async function getPlanningSnapshot(): Promise<PlanningSnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return { source: "demo", plans: demoPlans };
  }

  try {
    const result = await supabase.from("production_plans").select("*").order("planned_start", { ascending: true });
    if (result.error || !result.data?.length) {
      throw new Error("Planning data unavailable");
    }
    return {
      source: "supabase",
      plans: (result.data as Array<Record<string, unknown>>).map(mapPlan),
    };
  } catch {
    return { source: "demo", plans: demoPlans };
  }
}

export async function getEnergySnapshot(): Promise<EnergySnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return { source: "demo", records: demoEnergy };
  }

  try {
    const result = await supabase.from("energy_records").select("*").order("recorded_at", { ascending: false });
    if (result.error || !result.data?.length) {
      throw new Error("Energy data unavailable");
    }
    return {
      source: "supabase",
      records: (result.data as Array<Record<string, unknown>>).map(mapEnergy),
    };
  } catch {
    return { source: "demo", records: demoEnergy };
  }
}

export async function getInventorySnapshot(): Promise<InventorySnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return { source: "demo", items: demoInventory };
  }

  try {
    const result = await supabase.from("inventory_items").select("*").order("sku", { ascending: true });
    if (result.error || !result.data?.length) {
      throw new Error("Inventory data unavailable");
    }
    return {
      source: "supabase",
      items: (result.data as Array<Record<string, unknown>>).map(mapInventory),
    };
  } catch {
    return { source: "demo", items: demoInventory };
  }
}

export async function getOperatorSnapshot(): Promise<OperatorSnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return { source: "demo", operators: demoOperators };
  }

  try {
    const result = await supabase.from("operator_metrics").select("*").order("operator_name", { ascending: true });
    if (result.error || !result.data?.length) {
      throw new Error("Operator data unavailable");
    }
    return {
      source: "supabase",
      operators: (result.data as Array<Record<string, unknown>>).map(mapOperator),
    };
  } catch {
    return { source: "demo", operators: demoOperators };
  }
}

export async function getOptimizationSnapshot(): Promise<OptimizationSnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return { source: "demo", recommendations: demoOptimizations };
  }

  try {
    const result = await supabase
      .from("optimization_recommendations")
      .select("*")
      .order("expected_gain_percent", { ascending: false });
    if (result.error || !result.data?.length) {
      throw new Error("Optimization data unavailable");
    }
    return {
      source: "supabase",
      recommendations: (result.data as Array<Record<string, unknown>>).map(mapOptimization),
    };
  } catch {
    return { source: "demo", recommendations: demoOptimizations };
  }
}

export async function getRootCauseSnapshot(): Promise<RootCauseSnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return { source: "demo", cases: demoRootCauses };
  }

  try {
    const result = await supabase.from("root_cause_cases").select("*").order("confidence", { ascending: false });
    if (result.error || !result.data?.length) {
      throw new Error("Root cause data unavailable");
    }
    return {
      source: "supabase",
      cases: (result.data as Array<Record<string, unknown>>).map(mapRootCause),
    };
  } catch {
    return { source: "demo", cases: demoRootCauses };
  }
}

export async function getHandoverSnapshot(): Promise<HandoverSnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return { source: "demo", reports: demoShiftReports };
  }

  try {
    const result = await supabase.from("shift_handover_reports").select("*").order("start_at", { ascending: false });
    if (result.error || !result.data?.length) {
      throw new Error("Handover data unavailable");
    }
    return {
      source: "supabase",
      reports: (result.data as Array<Record<string, unknown>>).map(mapShiftReport),
    };
  } catch {
    return { source: "demo", reports: demoShiftReports };
  }
}

export async function getComplianceSnapshot(): Promise<ComplianceSnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return { source: "demo", entries: demoCompliance };
  }

  try {
    const result = await supabase.from("compliance_entries").select("*").order("due_date", { ascending: true });
    if (result.error || !result.data?.length) {
      throw new Error("Compliance data unavailable");
    }
    return {
      source: "supabase",
      entries: (result.data as Array<Record<string, unknown>>).map(mapCompliance),
    };
  } catch {
    return { source: "demo", entries: demoCompliance };
  }
}

export async function getGenealogySnapshot(): Promise<GenealogySnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return { source: "demo", records: demoGenealogy };
  }

  try {
    const result = await supabase.from("genealogy_records").select("*").order("started_at", { ascending: false });
    if (result.error || !result.data?.length) {
      throw new Error("Genealogy data unavailable");
    }
    return {
      source: "supabase",
      records: (result.data as Array<Record<string, unknown>>).map(mapGenealogy),
    };
  } catch {
    return { source: "demo", records: demoGenealogy };
  }
}

export async function getSpcSnapshot(): Promise<SpcSnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return { source: "demo", samples: demoSpc };
  }

  try {
    const result = await supabase.from("spc_samples").select("*").order("sampled_at", { ascending: false });
    if (result.error || !result.data?.length) {
      throw new Error("SPC data unavailable");
    }
    return {
      source: "supabase",
      samples: (result.data as Array<Record<string, unknown>>).map(mapSpc),
    };
  } catch {
    return { source: "demo", samples: demoSpc };
  }
}

export async function getAdvancedFeatureSnapshot(): Promise<AdvancedFeatureSnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return { source: "demo", modules: demoAdvancedModules };
  }

  try {
    const result = await supabase
      .from("advanced_feature_modules")
      .select("*")
      .order("priority", { ascending: false })
      .order("name", { ascending: true });
    if (result.error || !result.data?.length) {
      throw new Error("Advanced feature data unavailable");
    }
    return {
      source: "supabase",
      modules: (result.data as Array<Record<string, unknown>>).map(mapAdvancedFeature),
    };
  } catch {
    return { source: "demo", modules: demoAdvancedModules };
  }
}

export async function getInnovationIdeaSnapshot(): Promise<InnovationIdeaSnapshot> {
  const supabase = await createClient();

  if (!supabase) {
    return { source: "demo", ideas: demoInnovationIdeas };
  }

  try {
    const result = await supabase
      .from("innovation_ideas")
      .select("*")
      .order("impact_score", { ascending: false })
      .order("title", { ascending: true });
    if (result.error || !result.data?.length) {
      throw new Error("Innovation idea data unavailable");
    }
    return {
      source: "supabase",
      ideas: (result.data as Array<Record<string, unknown>>).map(mapInnovationIdea),
    };
  } catch {
    return { source: "demo", ideas: demoInnovationIdeas };
  }
}

function mapFacility(facility: SupabaseFacility) {
  return {
    id: facility.id,
    name: facility.name,
    location: facility.location,
    shift: facility.active_shift,
  };
}

function mapLine(row: Record<string, unknown>): ProductionLine {
  return {
    id: String(row.id),
    facilityId: String(row.facility_id),
    name: String(row.name),
    status: row.status as ProductionLine["status"],
    oee: Number(row.oee),
    throughput: Number(row.throughput),
    targetThroughput: Number(row.target_throughput),
    yieldRate: Number(row.yield_rate),
  };
}

function mapEquipment(row: Record<string, unknown>): Equipment {
  return {
    id: String(row.id),
    lineId: String(row.line_id),
    name: String(row.name),
    type: String(row.type),
    status: row.status as Equipment["status"],
    healthScore: Number(row.health_score),
    utilization: Number(row.utilization),
    energyKw: Number(row.energy_kw),
    lastService: String(row.last_service),
    digitalTwinState: String(row.digital_twin_state),
  };
}

function mapAlert(row: Record<string, unknown>): Alert {
  return {
    id: String(row.id),
    equipmentId: String(row.equipment_id),
    title: String(row.title),
    severity: row.severity as Alert["severity"],
    category: String(row.category),
    status: row.status as Alert["status"],
    createdAt: String(row.created_at),
    summary: String(row.summary),
  };
}

function mapMaintenance(row: Record<string, unknown>): MaintenancePrediction {
  return {
    id: String(row.id),
    equipmentId: String(row.equipment_id),
    issue: String(row.issue),
    confidence: Number(row.confidence),
    daysUntilService: Number(row.days_until_service),
    recommendedAction: String(row.recommended_action),
  };
}

function mapQualityEvent(row: Record<string, unknown>): QualityEvent {
  return {
    id: String(row.id),
    lineId: String(row.line_id),
    batchCode: String(row.batch_code),
    defectCategory: String(row.defect_category),
    defectRate: Number(row.defect_rate),
    firstPassYield: Number(row.first_pass_yield),
    status: row.status as QualityEvent["status"],
    checkedAt: String(row.checked_at),
  };
}

function mapConnectorStatus(row: Record<string, unknown>): ConnectorStatus {
  return {
    id: String(row.id),
    facilityId: String(row.facility_id),
    name: String(row.name),
    protocol: String(row.protocol),
    status: row.status as ConnectorStatus["status"],
    latencyMs: Number(row.latency_ms),
    recordsPerMin: Number(row.records_per_min),
    lastIngestedAt: String(row.last_ingested_at),
    notes: String(row.notes),
  };
}

function mapKpi(row: Record<string, unknown>): CustomKpi {
  return {
    id: String(row.id),
    facilityId: String(row.facility_id),
    name: String(row.name),
    formula: String(row.formula),
    targetValue: Number(row.target_value),
    currentValue: Number(row.current_value),
    unit: String(row.unit),
  };
}

function mapAnomaly(row: Record<string, unknown>): AnomalyEvent {
  return {
    id: String(row.id),
    facilityId: String(row.facility_id),
    equipmentId: String(row.equipment_id),
    signal: String(row.signal),
    severity: row.severity as AnomalyEvent["severity"],
    anomalyScore: Number(row.anomaly_score),
    status: row.status as AnomalyEvent["status"],
    detectedAt: String(row.detected_at),
    summary: String(row.summary),
  };
}

function mapHistoricalPoint(row: Record<string, unknown>): HistoricalPoint {
  return {
    id: String(row.id),
    lineId: String(row.line_id),
    metric: row.metric as HistoricalPoint["metric"],
    value: Number(row.value),
    recordedAt: String(row.recorded_at),
  };
}

function mapPlan(row: Record<string, unknown>): ProductionPlanItem {
  return {
    id: String(row.id),
    facilityId: String(row.facility_id),
    workOrder: String(row.work_order),
    product: String(row.product),
    assignedLine: String(row.assigned_line),
    targetUnits: Number(row.target_units),
    plannedStart: String(row.planned_start),
    plannedEnd: String(row.planned_end),
    status: row.status as ProductionPlanItem["status"],
  };
}

function mapEnergy(row: Record<string, unknown>): EnergyRecord {
  return {
    id: String(row.id),
    facilityId: String(row.facility_id),
    lineId: String(row.line_id),
    kwh: Number(row.kwh),
    intensityKwhPerUnit: Number(row.intensity_kwh_per_unit),
    peakKw: Number(row.peak_kw),
    recordedAt: String(row.recorded_at),
  };
}

function mapInventory(row: Record<string, unknown>): InventoryItem {
  return {
    id: String(row.id),
    sku: String(row.sku),
    name: String(row.name),
    category: row.category as InventoryItem["category"],
    onHand: Number(row.on_hand),
    wip: Number(row.wip),
    finishedGoods: Number(row.finished_goods),
    reorderPoint: Number(row.reorder_point),
    status: row.status as InventoryItem["status"],
  };
}

function mapOperator(row: Record<string, unknown>): OperatorMetric {
  return {
    id: String(row.id),
    operatorName: String(row.operator_name),
    shift: String(row.shift),
    efficiency: Number(row.efficiency),
    safetyIncidents: Number(row.safety_incidents),
    trainingGap: row.training_gap as OperatorMetric["trainingGap"],
    status: row.status as OperatorMetric["status"],
  };
}

function mapOptimization(row: Record<string, unknown>): OptimizationRecommendation {
  return {
    id: String(row.id),
    lineId: String(row.line_id),
    parameter: String(row.parameter),
    currentValue: Number(row.current_value),
    recommendedValue: Number(row.recommended_value),
    expectedGainPercent: Number(row.expected_gain_percent),
    confidence: Number(row.confidence),
    status: row.status as OptimizationRecommendation["status"],
  };
}

function mapRootCause(row: Record<string, unknown>): RootCauseCase {
  return {
    id: String(row.id),
    alertId: String(row.alert_id),
    issue: String(row.issue),
    probableCause: String(row.probable_cause),
    confidence: Number(row.confidence),
    recommendedAction: String(row.recommended_action),
    status: row.status as RootCauseCase["status"],
  };
}

function mapShiftReport(row: Record<string, unknown>): ShiftHandoverReport {
  return {
    id: String(row.id),
    facilityId: String(row.facility_id),
    shiftName: String(row.shift_name),
    startAt: String(row.start_at),
    endAt: String(row.end_at),
    summary: String(row.summary),
    oee: Number(row.oee),
    throughput: Number(row.throughput),
    incidents: Number(row.incidents),
    handoverNote: String(row.handover_note),
  };
}

function mapCompliance(row: Record<string, unknown>): ComplianceEntry {
  return {
    id: String(row.id),
    standard: String(row.standard),
    area: String(row.area),
    owner: String(row.owner),
    dueDate: String(row.due_date),
    status: row.status as ComplianceEntry["status"],
    evidenceLink: String(row.evidence_link),
  };
}

function mapGenealogy(row: Record<string, unknown>): GenealogyRecord {
  return {
    id: String(row.id),
    batchCode: String(row.batch_code),
    product: String(row.product),
    parentBatch: String(row.parent_batch),
    equipmentPath: String(row.equipment_path),
    qualityStatus: row.quality_status as GenealogyRecord["qualityStatus"],
    startedAt: String(row.started_at),
    completedAt: String(row.completed_at),
  };
}

function mapSpc(row: Record<string, unknown>): SpcSample {
  return {
    id: String(row.id),
    lineId: String(row.line_id),
    parameter: String(row.parameter),
    sampleValue: Number(row.sample_value),
    mean: Number(row.mean),
    lcl: Number(row.lcl),
    ucl: Number(row.ucl),
    status: row.status as SpcSample["status"],
    sampledAt: String(row.sampled_at),
  };
}

function mapAdvancedFeature(row: Record<string, unknown>): AdvancedFeatureModule {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    description: String(row.description),
    priority: row.priority as AdvancedFeatureModule["priority"],
    complexity: row.complexity as AdvancedFeatureModule["complexity"],
    adoptionPercent: Number(row.adoption_percent),
    latencyMs: Number(row.latency_ms),
    roiPercent: Number(row.roi_percent),
    status: row.status as AdvancedFeatureModule["status"],
    recommendation: String(row.recommendation),
  };
}

function mapInnovationIdea(row: Record<string, unknown>): InnovationIdea {
  return {
    id: String(row.id),
    title: String(row.title),
    summary: String(row.summary),
    impactScore: Number(row.impact_score),
    horizon: row.horizon as InnovationIdea["horizon"],
    readiness: row.readiness as InnovationIdea["readiness"],
  };
}

function deriveSiteStatus(oee: number, openAlerts: number): "strong" | "watch" | "risk" {
  if (oee < 82 || openAlerts >= 3) {
    return "risk";
  }

  if (oee < 90 || openAlerts >= 1) {
    return "watch";
  }

  return "strong";
}
