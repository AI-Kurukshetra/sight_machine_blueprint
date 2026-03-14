import { notFound } from "next/navigation";

import { requireAdminPage } from "@/lib/auth";
import {
  getAdvancedFeatureSnapshot,
  getAnomalySnapshot,
  getComplianceSnapshot,
  getDashboardSnapshot,
  getEnergySnapshot,
  getGenealogySnapshot,
  getHistoricalSnapshot,
  getInventorySnapshot,
  getOperatorSnapshot,
  getOptimizationSnapshot,
  getPlanningSnapshot,
  getSitesSnapshot,
  getSpcSnapshot,
} from "@/lib/data";
import { formatNumber, formatPercent } from "@/lib/utils";

type FeaturePageProps = {
  params: Promise<{ slug: string }>;
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-US");
}

function getStatusTone(status: "planned" | "pilot" | "active") {
  if (status === "active") return "pill-positive";
  if (status === "pilot") return "pill-warning";
  return "pill-critical";
}

function getPriorityTone(priority: "innovative" | "important") {
  return priority === "innovative" ? "pill-warning" : "pill-positive";
}

export default async function AdvancedFeatureDetailPage({ params }: FeaturePageProps) {
  await requireAdminPage();
  const { slug } = await params;

  const [
    advanced,
    dashboard,
    planning,
    inventory,
    historical,
    anomalies,
    compliance,
    genealogy,
    operators,
    sites,
    optimization,
    energy,
    spc,
  ] = await Promise.all([
    getAdvancedFeatureSnapshot(),
    getDashboardSnapshot(),
    getPlanningSnapshot(),
    getInventorySnapshot(),
    getHistoricalSnapshot(),
    getAnomalySnapshot(),
    getComplianceSnapshot(),
    getGenealogySnapshot(),
    getOperatorSnapshot(),
    getSitesSnapshot(),
    getOptimizationSnapshot(),
    getEnergySnapshot(),
    getSpcSnapshot(),
  ]);

  const featureModule = advanced.modules.find((item) => item.slug === slug);
  if (!featureModule) {
    notFound();
  }

  const totalThroughput = dashboard.productionLines.reduce((sum, line) => sum + line.throughput, 0);
  const totalEnergyKwh = energy.records.reduce((sum, record) => sum + record.kwh, 0);
  const carbonKg = totalEnergyKwh * 0.42;

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">{featureModule.slug}</p>
          <h1>{featureModule.name}</h1>
        </div>
        <p className="page-copy">{featureModule.description}</p>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <span className="eyebrow">Program status</span>
          <strong>{featureModule.status}</strong>
          <span className={`pill ${getStatusTone(featureModule.status)}`}>{featureModule.status}</span>
        </article>
        <article className="metric-card">
          <span className="eyebrow">Priority</span>
          <strong>{featureModule.priority}</strong>
          <span className={`pill ${getPriorityTone(featureModule.priority)}`}>{featureModule.priority}</span>
        </article>
        <article className="metric-card">
          <span className="eyebrow">Adoption</span>
          <strong>{formatPercent(featureModule.adoptionPercent, 0)}</strong>
          <span className="metric-change metric-warning">Cross-site enablement</span>
        </article>
        <article className="metric-card">
          <span className="eyebrow">Projected ROI</span>
          <strong>{formatPercent(featureModule.roiPercent)}</strong>
          <span className="metric-change metric-positive">Target business value</span>
        </article>
      </section>

      {slug === "ai-powered-production-optimization" ? (
        <section className="content-grid">
          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Schedule optimization</p>
                <h2>Real-time production plan tuning</h2>
              </div>
            </div>
            <div className="stack-md">
              {planning.plans.map((plan) => (
                <div key={plan.id} className="line-card">
                  <div>
                    <strong>{plan.workOrder}</strong>
                    <p>
                      {plan.product} · {plan.assignedLine} · {plan.targetUnits} units
                    </p>
                  </div>
                  <span className={`pill ${plan.status === "delayed" ? "pill-critical" : "pill-positive"}`}>
                    {plan.status}
                  </span>
                </div>
              ))}
            </div>
          </article>
          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Recommendation engine</p>
                <h2>Parameter actions</h2>
              </div>
            </div>
            <div className="stack-md">
              {optimization.recommendations.map((item) => (
                <div key={item.id} className="maintenance-card">
                  <div>
                    <strong>{item.parameter}</strong>
                    <p>{item.lineId}</p>
                  </div>
                  <div className="maintenance-meta">
                    <span>{formatPercent(item.expectedGainPercent)} expected gain</span>
                    <span>{item.confidence}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {slug === "augmented-reality-maintenance" ? (
        <section className="content-grid">
          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">AR maintenance queue</p>
                <h2>Step-guided interventions</h2>
              </div>
            </div>
            <div className="stack-md">
              {dashboard.maintenance.map((item) => (
                <div key={item.id} className="maintenance-card">
                  <div>
                    <strong>{item.issue}</strong>
                    <p>{item.recommendedAction}</p>
                  </div>
                  <div className="maintenance-meta">
                    <span>{item.confidence}% model confidence</span>
                    <span>{item.daysUntilService} day window</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
          <article className="panel">
            <p className="eyebrow">Overlay readiness</p>
            <h2>Digital twin state sync</h2>
            <div className="stack-md">
              {dashboard.equipment.map((item) => (
                <div key={item.id} className="line-card">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.digitalTwinState}</p>
                  </div>
                  <span className={`pill ${item.status === "running" ? "pill-positive" : "pill-warning"}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {slug === "digital-factory-simulation" ? (
        <section className="table-panel">
          <div className="table-header">
            <span>Line</span>
            <span>Current OEE</span>
            <span>Scenario OEE</span>
            <span>Current Throughput</span>
            <span>Scenario Throughput</span>
            <span>Outcome</span>
          </div>
          {dashboard.productionLines.map((line) => {
            const scenarioOee = Number((line.oee + 2.3).toFixed(1));
            const scenarioThroughput = Math.round(line.throughput * 1.06);
            return (
              <div key={line.id} className="table-row">
                <div>{line.name}</div>
                <div>{formatPercent(line.oee)}</div>
                <div>{formatPercent(scenarioOee)}</div>
                <div>{line.throughput}</div>
                <div>{scenarioThroughput}</div>
                <div>
                  <span className="pill pill-positive">recommended</span>
                </div>
              </div>
            );
          })}
        </section>
      ) : null}

      {slug === "autonomous-quality-control" ? (
        <section className="content-grid">
          <article className="panel">
            <p className="eyebrow">Vision quality stream</p>
            <h2>Defect classification feed</h2>
            <div className="stack-md">
              {dashboard.qualityEvents.map((event) => (
                <div key={event.id} className="line-card">
                  <div>
                    <strong>{event.batchCode}</strong>
                    <p>{event.defectCategory}</p>
                  </div>
                  <span className={`pill ${event.status === "stable" ? "pill-positive" : "pill-warning"}`}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </article>
          <article className="panel">
            <p className="eyebrow">SPC control envelope</p>
            <h2>Critical parameter tracking</h2>
            <div className="stack-md">
              {spc.samples.map((sample) => (
                <div key={sample.id} className="line-card">
                  <div>
                    <strong>{sample.parameter}</strong>
                    <p>
                      value {sample.sampleValue} · limits {sample.lcl} - {sample.ucl}
                    </p>
                  </div>
                  <span className={`pill ${sample.status === "in_control" ? "pill-positive" : "pill-warning"}`}>
                    {sample.status}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {slug === "supply-chain-integration" ? (
        <section className="content-grid">
          <article className="panel">
            <p className="eyebrow">Material availability</p>
            <h2>Inventory-linked risk</h2>
            <div className="stack-md">
              {inventory.items.map((item) => (
                <div key={item.id} className="line-card">
                  <div>
                    <strong>{item.sku}</strong>
                    <p>{item.name}</p>
                  </div>
                  <span className={`pill ${item.status === "critical" ? "pill-critical" : "pill-positive"}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </article>
          <article className="panel">
            <p className="eyebrow">Order-plan alignment</p>
            <h2>Execution windows</h2>
            <div className="stack-md">
              {planning.plans.map((plan) => (
                <div key={plan.id} className="maintenance-card">
                  <div>
                    <strong>{plan.workOrder}</strong>
                    <p>{plan.product}</p>
                  </div>
                  <div className="maintenance-meta">
                    <span>{formatTimestamp(plan.plannedStart)}</span>
                    <span>{formatTimestamp(plan.plannedEnd)}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {slug === "edge-ai-processing" ? (
        <section className="content-grid">
          <article className="panel">
            <p className="eyebrow">Edge inferencing</p>
            <h2>Low-latency anomaly response</h2>
            <div className="stack-md">
              {anomalies.anomalies.map((item) => (
                <div key={item.id} className="line-card">
                  <div>
                    <strong>{item.signal}</strong>
                    <p>{item.summary}</p>
                  </div>
                  <span className={`pill pill-severity-${item.severity}`}>{item.severity}</span>
                </div>
              ))}
            </div>
          </article>
          <article className="panel">
            <p className="eyebrow">Processing envelope</p>
            <h2>Target latency budget</h2>
            <p>
              Current module latency target is <strong>{featureModule.latencyMs} ms</strong>, with adoption at{" "}
              <strong>{formatPercent(featureModule.adoptionPercent, 0)}</strong>.
            </p>
          </article>
        </section>
      ) : null}

      {slug === "natural-language-query-interface" ? (
        <section className="stack-md">
          <article className="panel">
            <p className="eyebrow">Query simulation</p>
            <h2>Natural language operations assistant</h2>
            <div className="stack-md">
              <div className="alert-card">
                <strong>Query:</strong>
                <p>Which line has the highest risk right now?</p>
                <strong>Answer:</strong>
                <p>
                  {dashboard.productionLines.sort((a, b) => a.oee - b.oee)[0]?.name ?? "N/A"} shows the
                  lowest OEE and highest intervention requirement.
                </p>
              </div>
              <div className="alert-card">
                <strong>Query:</strong>
                <p>What should be serviced in the next 24 hours?</p>
                <strong>Answer:</strong>
                <p>
                  {dashboard.maintenance.filter((item) => item.daysUntilService <= 1).length} assets are due
                  immediately based on predictive maintenance confidence.
                </p>
              </div>
            </div>
          </article>
        </section>
      ) : null}

      {slug === "blockchain-quality-certificates" ? (
        <section className="content-grid">
          <article className="panel">
            <p className="eyebrow">Certificate chain</p>
            <h2>Batch provenance</h2>
            <div className="stack-md">
              {genealogy.records.map((item) => (
                <div key={item.id} className="line-card">
                  <div>
                    <strong>{item.batchCode}</strong>
                    <p>{item.equipmentPath}</p>
                  </div>
                  <span className={`pill ${item.qualityStatus === "pass" ? "pill-positive" : "pill-warning"}`}>
                    {item.qualityStatus}
                  </span>
                </div>
              ))}
            </div>
          </article>
          <article className="panel">
            <p className="eyebrow">Audit controls</p>
            <h2>Compliance anchor records</h2>
            <div className="stack-md">
              {compliance.entries.map((entry) => (
                <div key={entry.id} className="maintenance-card">
                  <div>
                    <strong>{entry.standard}</strong>
                    <p>{entry.area}</p>
                  </div>
                  <div className="maintenance-meta">
                    <span>{entry.owner}</span>
                    <span>{entry.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {slug === "collaborative-robot-integration" ? (
        <section className="content-grid">
          <article className="panel">
            <p className="eyebrow">Robot task coordination</p>
            <h2>Cobot cell performance</h2>
            <div className="stack-md">
              {dashboard.equipment
                .filter((item) => item.type.toLowerCase().includes("robot"))
                .map((item) => (
                  <div key={item.id} className="line-card">
                    <div>
                      <strong>{item.name}</strong>
                      <p>
                        utilization {item.utilization}% · health {item.healthScore}%
                      </p>
                    </div>
                    <span className={`pill ${item.status === "running" ? "pill-positive" : "pill-warning"}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
            </div>
          </article>
          <article className="panel">
            <p className="eyebrow">Operator-cobot pairing</p>
            <h2>Collaborative efficiency</h2>
            <div className="stack-md">
              {operators.operators.map((operator) => (
                <div key={operator.id} className="maintenance-card">
                  <div>
                    <strong>{operator.operatorName}</strong>
                    <p>{operator.shift} shift</p>
                  </div>
                  <div className="maintenance-meta">
                    <span>{operator.efficiency}% efficiency</span>
                    <span>{operator.trainingGap} training gap</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {slug === "carbon-footprint-tracking" ? (
        <section className="content-grid">
          <article className="panel">
            <p className="eyebrow">Carbon model</p>
            <h2>Real-time emission estimate</h2>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">Total energy</span>
                <strong>{formatNumber(Math.round(totalEnergyKwh))} kWh</strong>
              </div>
              <div>
                <span className="eyebrow">Estimated emissions</span>
                <strong>{formatNumber(Math.round(carbonKg))} kg CO2e</strong>
              </div>
              <div>
                <span className="eyebrow">Throughput normalized</span>
                <strong>{(carbonKg / Math.max(totalThroughput, 1)).toFixed(2)} kg CO2e/unit</strong>
              </div>
            </div>
          </article>
          <article className="panel">
            <p className="eyebrow">Line energy profile</p>
            <h2>Emission hotspots</h2>
            <div className="stack-md">
              {energy.records.map((record) => (
                <div key={record.id} className="line-card">
                  <div>
                    <strong>{record.lineId}</strong>
                    <p>{record.kwh} kWh · peak {record.peakKw} kW</p>
                  </div>
                  <span className="pill pill-warning">{(record.kwh * 0.42).toFixed(0)} kg CO2e</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {slug === "advanced-process-mining" ? (
        <section className="content-grid">
          <article className="panel">
            <p className="eyebrow">Process mining graph</p>
            <h2>Bottleneck discovery</h2>
            <div className="stack-md">
              {dashboard.productionLines.map((line) => {
                const lineHistory = historical.points.filter((point) => point.lineId === line.id);
                return (
                  <div key={line.id} className="line-card">
                    <div>
                      <strong>{line.name}</strong>
                      <p>{lineHistory.length} telemetry points mapped</p>
                    </div>
                    <span className="pill pill-warning">{formatPercent(line.oee)}</span>
                  </div>
                );
              })}
            </div>
          </article>
          <article className="panel">
            <p className="eyebrow">Exception clustering</p>
            <h2>Anomaly concentration</h2>
            <div className="stack-md">
              {anomalies.anomalies.map((item) => (
                <div key={item.id} className="maintenance-card">
                  <div>
                    <strong>{item.signal}</strong>
                    <p>{item.equipmentId}</p>
                  </div>
                  <div className="maintenance-meta">
                    <span>{item.anomalyScore} score</span>
                    <span>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {slug === "federated-learning-platform" ? (
        <section className="content-grid">
          <article className="panel">
            <p className="eyebrow">Cross-site model federation</p>
            <h2>Participating facilities</h2>
            <div className="stack-md">
              {sites.sites.map((site) => (
                <div key={site.facilityId} className="line-card">
                  <div>
                    <strong>{site.facilityName}</strong>
                    <p>{site.location}</p>
                  </div>
                  <span className={`pill ${site.status === "risk" ? "pill-critical" : "pill-positive"}`}>
                    {site.status}
                  </span>
                </div>
              ))}
            </div>
          </article>
          <article className="panel">
            <p className="eyebrow">Global model updates</p>
            <h2>Federated recommendation feed</h2>
            <div className="stack-md">
              {optimization.recommendations.map((item) => (
                <div key={item.id} className="maintenance-card">
                  <div>
                    <strong>{item.parameter}</strong>
                    <p>{item.lineId}</p>
                  </div>
                  <div className="maintenance-meta">
                    <span>{item.confidence}% confidence</span>
                    <span>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      <section className="panel">
        <p className="eyebrow">Execution guidance</p>
        <h2>Recommended next step</h2>
        <p>{featureModule.recommendation}</p>
      </section>
    </div>
  );
}
