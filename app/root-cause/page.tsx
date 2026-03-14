import { getRootCauseSnapshot } from "@/lib/data";

function statusClass(status: "open" | "validated" | "closed") {
  if (status === "closed") return "pill-positive";
  if (status === "validated") return "pill-warning";
  return "pill-critical";
}

export default async function RootCausePage() {
  const snapshot = await getRootCauseSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Root cause analysis</p>
          <h1>Issue causality workbench</h1>
        </div>
        <p className="page-copy">
          Analyze likely causal drivers behind quality and production incidents.
        </p>
      </section>

      <section className="stack-md">
        {snapshot.cases.map((item) => (
          <article key={item.id} className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">{item.alertId}</p>
                <h2>{item.issue}</h2>
              </div>
              <span className={`pill ${statusClass(item.status)}`}>{item.status}</span>
            </div>
            <p>{item.probableCause}</p>
            <p>{item.recommendedAction}</p>
            <p>{item.confidence}% confidence</p>
          </article>
        ))}
      </section>
    </div>
  );
}
