import { requireAdminPage } from "@/lib/auth";
import { getOptimizationSnapshot } from "@/lib/data";
import { formatPercent } from "@/lib/utils";

export default async function OptimizationPage() {
  await requireAdminPage();
  const snapshot = await getOptimizationSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Process optimization</p>
          <h1>AI parameter recommendations</h1>
        </div>
        <p className="page-copy">
          Evaluate recommended machine settings and expected gain before rollout.
        </p>
      </section>

      <section className="stack-md">
        {snapshot.recommendations.map((item) => (
          <article key={item.id} className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">{item.lineId}</p>
                <h2>{item.parameter}</h2>
              </div>
              <span className={`pill ${item.status === "applied" ? "pill-positive" : "pill-warning"}`}>
                {item.status}
              </span>
            </div>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">Current</span>
                <strong>{item.currentValue}</strong>
              </div>
              <div>
                <span className="eyebrow">Recommended</span>
                <strong>{item.recommendedValue}</strong>
              </div>
              <div>
                <span className="eyebrow">Expected gain</span>
                <strong>{formatPercent(item.expectedGainPercent)}</strong>
              </div>
            </div>
            <p>{item.confidence}% confidence</p>
          </article>
        ))}
      </section>
    </div>
  );
}
