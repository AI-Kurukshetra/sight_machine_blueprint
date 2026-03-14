import { getDashboardSnapshot } from "@/lib/data";
import { formatRelativeDays } from "@/lib/utils";

export default async function MaintenancePage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Predictive maintenance</p>
          <h1>Failure risk forecast</h1>
        </div>
        <p className="page-copy">
          Surface the next likely intervention and the recommended action before throughput drops.
        </p>
      </section>

      <section className="content-grid">
        {snapshot.maintenance.map((item) => (
          <article key={item.id} className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">
                  {snapshot.equipment.find((entry) => entry.id === item.equipmentId)?.type ?? "Equipment"}
                </p>
                <h2>{snapshot.equipment.find((entry) => entry.id === item.equipmentId)?.name ?? item.equipmentId}</h2>
              </div>
              <span className={`pill ${item.daysUntilService <= 1 ? "pill-critical" : "pill-warning"}`}>
                {formatRelativeDays(item.daysUntilService)}
              </span>
            </div>
            <div className="stack-md">
              <div>
                <span className="eyebrow">Predicted issue</span>
                <strong>{item.issue}</strong>
              </div>
              <div className="progress-block">
                <span>{item.confidence}% confidence</span>
                <div className="progress-bar">
                  <div style={{ width: `${item.confidence}%` }} />
                </div>
              </div>
              <p>{item.recommendedAction}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
