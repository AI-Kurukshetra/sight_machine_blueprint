import { getOperatorSnapshot } from "@/lib/data";
import { formatPercent } from "@/lib/utils";

function statusClass(status: "strong" | "watch" | "needs_support") {
  if (status === "strong") return "pill-positive";
  if (status === "watch") return "pill-warning";
  return "pill-critical";
}

export default async function OperatorsPage() {
  const snapshot = await getOperatorSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Operator analytics</p>
          <h1>Performance and capability insights</h1>
        </div>
        <p className="page-copy">
          Track operator efficiency, safety posture, and training gaps by shift.
        </p>
      </section>

      <section className="content-grid">
        {snapshot.operators.map((item) => (
          <article key={item.id} className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">{item.shift} shift</p>
                <h2>{item.operatorName}</h2>
              </div>
              <span className={`pill ${statusClass(item.status)}`}>{item.status.replace("_", " ")}</span>
            </div>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">Efficiency</span>
                <strong>{formatPercent(item.efficiency)}</strong>
              </div>
              <div>
                <span className="eyebrow">Safety incidents</span>
                <strong>{item.safetyIncidents}</strong>
              </div>
              <div>
                <span className="eyebrow">Training gap</span>
                <strong>{item.trainingGap}</strong>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
