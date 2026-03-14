import { KpiLab } from "@/components/kpi-lab";
import { requireAdminPage } from "@/lib/auth";
import { getDashboardSnapshot, getKpiSnapshot } from "@/lib/data";
import { formatPercent } from "@/lib/utils";

export default async function KpisPage() {
  await requireAdminPage();
  const [kpiSnapshot, dashboard] = await Promise.all([getKpiSnapshot(), getDashboardSnapshot()]);
  const baseline = {
    throughput: dashboard.productionLines.reduce((sum, line) => sum + line.throughput, 0),
    quality:
      dashboard.qualityEvents.reduce((sum, event) => sum + event.firstPassYield, 0) /
      Math.max(dashboard.qualityEvents.length, 1),
    downtime: dashboard.alerts.filter((alert) => alert.status !== "resolved").length * 12,
    energy: dashboard.equipment.reduce((sum, item) => sum + item.energyKw, 0),
  };

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Build</p>
          <h1>Custom KPI Builder</h1>
        </div>
        <p className="page-copy">
          Define and test manufacturing KPIs without waiting for code deploys, then calibrate target
          thresholds to each plant.
        </p>
      </section>

      <section className="kpi-grid">
        {kpiSnapshot.kpis.map((kpi) => (
          <article key={kpi.id} className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">{kpi.unit}</p>
                <h2>{kpi.name}</h2>
              </div>
              <span className={`pill ${kpi.currentValue <= kpi.targetValue ? "pill-positive" : "pill-warning"}`}>
                {kpi.currentValue <= kpi.targetValue ? "Within target" : "Above target"}
              </span>
            </div>
            <p>{kpi.formula}</p>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">Current</span>
                <strong>{kpi.currentValue}</strong>
              </div>
              <div>
                <span className="eyebrow">Target</span>
                <strong>{kpi.targetValue}</strong>
              </div>
              <div>
                <span className="eyebrow">Variance</span>
                <strong>
                  {kpi.targetValue === 0
                    ? "N/A"
                    : formatPercent(((kpi.currentValue - kpi.targetValue) / kpi.targetValue) * 100)}
                </strong>
              </div>
            </div>
          </article>
        ))}
      </section>

      <KpiLab baseline={baseline} />
    </div>
  );
}
