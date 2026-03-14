import { getDashboardSnapshot } from "@/lib/data";

export default async function AlertsPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Real-time alerting</p>
          <h1>Escalation queue</h1>
        </div>
        <p className="page-copy">
          Configurable alert streams for equipment, performance, and quality exceptions.
        </p>
      </section>

      <section className="stack-md">
        {snapshot.alerts.map((alert) => (
          <article key={alert.id} className="panel alert-panel">
            <div className="panel-head">
              <div>
                <span className={`pill pill-severity-${alert.severity}`}>{alert.severity}</span>
                <h2>{alert.title}</h2>
              </div>
              <span className={`pill pill-${alert.status === "investigating" ? "attention" : alert.status}`}>
                {alert.status}
              </span>
            </div>
            <p>{alert.summary}</p>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">Asset</span>
                <strong>{snapshot.equipment.find((item) => item.id === alert.equipmentId)?.name ?? alert.equipmentId}</strong>
              </div>
              <div>
                <span className="eyebrow">Category</span>
                <strong>{alert.category}</strong>
              </div>
              <div>
                <span className="eyebrow">Opened</span>
                <strong>{new Date(alert.createdAt).toLocaleString("en-US")}</strong>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
