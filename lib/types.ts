export type UserRole = "admin" | "plant_manager" | "operator";

export type Facility = {
  id: string;
  name: string;
  location: string;
  shift: string;
};

export type ProductionLine = {
  id: string;
  facilityId: string;
  name: string;
  status: "running" | "attention" | "maintenance";
  oee: number;
  throughput: number;
  targetThroughput: number;
  yieldRate: number;
};

export type Equipment = {
  id: string;
  lineId: string;
  name: string;
  type: string;
  status: "running" | "warning" | "maintenance";
  healthScore: number;
  utilization: number;
  energyKw: number;
  lastService: string;
  digitalTwinState: string;
};

export type Alert = {
  id: string;
  equipmentId: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  status: "open" | "investigating" | "resolved";
  createdAt: string;
  summary: string;
};

export type MaintenancePrediction = {
  id: string;
  equipmentId: string;
  issue: string;
  confidence: number;
  daysUntilService: number;
  recommendedAction: string;
};

export type QualityEvent = {
  id: string;
  lineId: string;
  batchCode: string;
  defectCategory: string;
  defectRate: number;
  firstPassYield: number;
  status: "stable" | "watch" | "intervention";
  checkedAt: string;
};

export type ConnectorStatus = {
  id: string;
  facilityId: string;
  name: string;
  protocol: string;
  status: "healthy" | "degraded" | "offline";
  latencyMs: number;
  recordsPerMin: number;
  lastIngestedAt: string;
  notes: string;
};

export type CustomKpi = {
  id: string;
  facilityId: string;
  name: string;
  formula: string;
  targetValue: number;
  currentValue: number;
  unit: string;
};

export type SitePerformance = {
  facilityId: string;
  facilityName: string;
  location: string;
  lineCount: number;
  oee: number;
  throughput: number;
  openAlerts: number;
  status: "strong" | "watch" | "risk";
};

export type AnomalyEvent = {
  id: string;
  facilityId: string;
  equipmentId: string;
  signal: string;
  severity: "critical" | "high" | "medium" | "low";
  anomalyScore: number;
  status: "new" | "reviewing" | "resolved";
  detectedAt: string;
  summary: string;
};

export type HistoricalPoint = {
  id: string;
  lineId: string;
  metric: "oee" | "throughput" | "yield" | "defect_rate";
  value: number;
  recordedAt: string;
};

export type ProductionPlanItem = {
  id: string;
  facilityId: string;
  workOrder: string;
  product: string;
  assignedLine: string;
  targetUnits: number;
  plannedStart: string;
  plannedEnd: string;
  status: "scheduled" | "in_progress" | "delayed" | "completed";
};

export type EnergyRecord = {
  id: string;
  facilityId: string;
  lineId: string;
  kwh: number;
  intensityKwhPerUnit: number;
  peakKw: number;
  recordedAt: string;
};

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  category: "raw_material" | "wip" | "finished_good";
  onHand: number;
  wip: number;
  finishedGoods: number;
  reorderPoint: number;
  status: "healthy" | "watch" | "critical";
};

export type OperatorMetric = {
  id: string;
  operatorName: string;
  shift: string;
  efficiency: number;
  safetyIncidents: number;
  trainingGap: "low" | "medium" | "high";
  status: "strong" | "watch" | "needs_support";
};

export type OptimizationRecommendation = {
  id: string;
  lineId: string;
  parameter: string;
  currentValue: number;
  recommendedValue: number;
  expectedGainPercent: number;
  confidence: number;
  status: "ready" | "testing" | "applied";
};

export type RootCauseCase = {
  id: string;
  alertId: string;
  issue: string;
  probableCause: string;
  confidence: number;
  recommendedAction: string;
  status: "open" | "validated" | "closed";
};

export type ShiftHandoverReport = {
  id: string;
  facilityId: string;
  shiftName: string;
  startAt: string;
  endAt: string;
  summary: string;
  oee: number;
  throughput: number;
  incidents: number;
  handoverNote: string;
};

export type ComplianceEntry = {
  id: string;
  standard: string;
  area: string;
  owner: string;
  dueDate: string;
  status: "compliant" | "at_risk" | "non_compliant";
  evidenceLink: string;
};

export type GenealogyRecord = {
  id: string;
  batchCode: string;
  product: string;
  parentBatch: string;
  equipmentPath: string;
  qualityStatus: "pass" | "hold" | "fail";
  startedAt: string;
  completedAt: string;
};

export type SpcSample = {
  id: string;
  lineId: string;
  parameter: string;
  sampleValue: number;
  mean: number;
  lcl: number;
  ucl: number;
  status: "in_control" | "warning" | "out_of_control";
  sampledAt: string;
};

export type AdvancedFeatureModule = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priority: "innovative" | "important";
  complexity: "high" | "medium" | "low";
  adoptionPercent: number;
  latencyMs: number;
  roiPercent: number;
  status: "planned" | "pilot" | "active";
  recommendation: string;
};

export type InnovationIdea = {
  id: string;
  title: string;
  summary: string;
  impactScore: number;
  horizon: "near_term" | "mid_term" | "long_term";
  readiness: "concept" | "prototype" | "validated";
};

export type DemoData = {
  facility: Facility;
  productionLines: ProductionLine[];
  equipment: Equipment[];
  alerts: Alert[];
  maintenance: MaintenancePrediction[];
  qualityEvents: QualityEvent[];
};

export type DashboardSnapshot = {
  source: "supabase" | "demo";
  facility: Facility;
  productionLines: ProductionLine[];
  equipment: Equipment[];
  alerts: Alert[];
  maintenance: MaintenancePrediction[];
  qualityEvents: QualityEvent[];
  summary: Array<{
    label: string;
    value: string;
    change: string;
    tone: "positive" | "warning" | "critical";
  }>;
};

export type ConnectSnapshot = {
  source: "supabase" | "demo";
  connectors: ConnectorStatus[];
};

export type SitesSnapshot = {
  source: "supabase" | "demo";
  sites: SitePerformance[];
};

export type KpiSnapshot = {
  source: "supabase" | "demo";
  kpis: CustomKpi[];
};

export type AnomalySnapshot = {
  source: "supabase" | "demo";
  anomalies: AnomalyEvent[];
};

export type HistoricalSnapshot = {
  source: "supabase" | "demo";
  points: HistoricalPoint[];
};

export type PlanningSnapshot = {
  source: "supabase" | "demo";
  plans: ProductionPlanItem[];
};

export type EnergySnapshot = {
  source: "supabase" | "demo";
  records: EnergyRecord[];
};

export type InventorySnapshot = {
  source: "supabase" | "demo";
  items: InventoryItem[];
};

export type OperatorSnapshot = {
  source: "supabase" | "demo";
  operators: OperatorMetric[];
};

export type OptimizationSnapshot = {
  source: "supabase" | "demo";
  recommendations: OptimizationRecommendation[];
};

export type RootCauseSnapshot = {
  source: "supabase" | "demo";
  cases: RootCauseCase[];
};

export type HandoverSnapshot = {
  source: "supabase" | "demo";
  reports: ShiftHandoverReport[];
};

export type ComplianceSnapshot = {
  source: "supabase" | "demo";
  entries: ComplianceEntry[];
};

export type GenealogySnapshot = {
  source: "supabase" | "demo";
  records: GenealogyRecord[];
};

export type SpcSnapshot = {
  source: "supabase" | "demo";
  samples: SpcSample[];
};

export type AdvancedFeatureSnapshot = {
  source: "supabase" | "demo";
  modules: AdvancedFeatureModule[];
};

export type InnovationIdeaSnapshot = {
  source: "supabase" | "demo";
  ideas: InnovationIdea[];
};
