import { getDashboardSnapshot } from "@/lib/data";
import { formatPercent, formatRelativeDays } from "@/lib/utils";

export default async function MobileOperationsPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Mobile operations dashboard</p>
          <h1>Shift-ready view for managers and operators</h1>
        </div>
        <p className="page-copy">
          Compact, phone-first operations snapshot for line status, active alerts, and near-term
          maintenance actions.
        </p>
      </section>

      <section className="metric-grid">
        {snapshot.summary.slice(0, 3).map((item) => (
          <article key={item.label} className="metric-card">
            <span className="eyebrow">{item.label}</span>
            <strong>{item.value}</strong>
            <span className={`metric-change metric-${item.tone}`}>{item.change}</span>
          </article>
        ))}
      </section>

      <section className="table-panel">
        <div className="table-header">
          <span>Line</span>
          <span>State</span>
          <span>OEE</span>
          <span>Throughput</span>
          <span>Yield</span>
          <span>Action</span>
        </div>
        {snapshot.productionLines.map((line) => (
          <div key={line.id} className="table-row">
            <div>{line.name}</div>
            <div>
              <span className={`pill pill-${line.status}`}>{line.status}</span>
            </div>
            <div>{formatPercent(line.oee)}</div>
            <div>
              {line.throughput}/{line.targetThroughput}
            </div>
            <div>{formatPercent(line.yieldRate)}</div>
            <div>{line.status === "running" ? "Monitor" : "Investigate"}</div>
          </div>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Active alerts</p>
              <h2>Escalation queue</h2>
            </div>
          </div>
          <div className="stack-md">
            {snapshot.alerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="alert-card">
                <div className="alert-head">
                  <span className={`pill pill-severity-${alert.severity}`}>{alert.severity}</span>
                  <span>{alert.category}</span>
                </div>
                <strong>{alert.title}</strong>
                <p>{alert.summary}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Next maintenance</p>
              <h2>Immediate worklist</h2>
            </div>
          </div>
          <div className="stack-md">
            {snapshot.maintenance.slice(0, 4).map((item) => (
              <div key={item.id} className="maintenance-card">
                <div>
                  <strong>{item.issue}</strong>
                  <p>{item.recommendedAction}</p>
                </div>
                <div className="maintenance-meta">
                  <span>{item.confidence}% confidence</span>
                  <span>{formatRelativeDays(item.daysUntilService)}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
