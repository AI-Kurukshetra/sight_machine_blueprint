import { getAnomalySnapshot } from "@/lib/data";

function statusClass(status: "new" | "reviewing" | "resolved") {
  if (status === "resolved") return "pill-positive";
  if (status === "reviewing") return "pill-warning";
  return "pill-critical";
}

export default async function AnomaliesPage() {
  const snapshot = await getAnomalySnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Anomaly detection</p>
          <h1>Unusual pattern detection queue</h1>
        </div>
        <p className="page-copy">
          ML-driven anomaly signals across equipment and process telemetry with severity and investigation
          lifecycle tracking.
        </p>
      </section>

      <section className="stack-md">
        {snapshot.anomalies.map((item) => (
          <article key={item.id} className="panel">
            <div className="panel-head">
              <div>
                <span className={`pill pill-severity-${item.severity}`}>{item.severity}</span>
                <h2>{item.signal}</h2>
              </div>
              <span className={`pill ${statusClass(item.status)}`}>{item.status}</span>
            </div>
            <p>{item.summary}</p>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">Equipment</span>
                <strong>{item.equipmentId}</strong>
              </div>
              <div>
                <span className="eyebrow">Anomaly score</span>
                <strong>{item.anomalyScore}</strong>
              </div>
              <div>
                <span className="eyebrow">Detected</span>
                <strong>{new Date(item.detectedAt).toLocaleString("en-US")}</strong>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
