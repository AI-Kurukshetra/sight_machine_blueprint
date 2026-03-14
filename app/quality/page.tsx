import { getDashboardSnapshot } from "@/lib/data";
import { formatPercent } from "@/lib/utils";

export default async function QualityPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Quality analytics</p>
          <h1>Defect and first-pass yield tracking</h1>
        </div>
        <p className="page-copy">
          Monitor batch-level quality drift and intervene before defects accumulate.
        </p>
      </section>

      <section className="content-grid">
        {snapshot.qualityEvents.map((event) => (
          <article key={event.id} className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">
                  {snapshot.productionLines.find((line) => line.id === event.lineId)?.name ?? event.lineId}
                </p>
                <h2>{event.batchCode}</h2>
              </div>
              <span className={`pill pill-quality-${event.status}`}>{event.status}</span>
            </div>
            <div className="quality-stat-row">
              <div>
                <span className="eyebrow">Defect category</span>
                <strong>{event.defectCategory}</strong>
              </div>
              <div>
                <span className="eyebrow">Defect rate</span>
                <strong>{formatPercent(event.defectRate)}</strong>
              </div>
              <div>
                <span className="eyebrow">FPY</span>
                <strong>{formatPercent(event.firstPassYield)}</strong>
              </div>
            </div>
            <p>Checked {new Date(event.checkedAt).toLocaleString("en-US")}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
