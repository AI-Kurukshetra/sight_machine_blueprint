import { getHandoverSnapshot } from "@/lib/data";
import { formatPercent } from "@/lib/utils";

export default async function HandoverPage() {
  const snapshot = await getHandoverSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Shift handover reports</p>
          <h1>Automated shift summaries</h1>
        </div>
        <p className="page-copy">
          Capture shift performance and handover context for smooth cross-shift continuity.
        </p>
      </section>

      <section className="stack-md">
        {snapshot.reports.map((item) => (
          <article key={item.id} className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">{item.shiftName}</p>
                <h2>{item.facilityId}</h2>
              </div>
              <span className="pill pill-warning">{new Date(item.startAt).toLocaleDateString("en-US")}</span>
            </div>
            <p>{item.summary}</p>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">OEE</span>
                <strong>{formatPercent(item.oee)}</strong>
              </div>
              <div>
                <span className="eyebrow">Throughput</span>
                <strong>{item.throughput}</strong>
              </div>
              <div>
                <span className="eyebrow">Incidents</span>
                <strong>{item.incidents}</strong>
              </div>
            </div>
            <p>{item.handoverNote}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
