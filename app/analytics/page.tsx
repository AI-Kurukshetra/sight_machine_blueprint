import { getHistoricalSnapshot } from "@/lib/data";

export default async function AnalyticsPage() {
  const snapshot = await getHistoricalSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Historical analytics</p>
          <h1>Time-series operations history</h1>
        </div>
        <p className="page-copy">
          Trend visibility for OEE, throughput, yield, and defect dynamics to support continuous
          optimization decisions.
        </p>
      </section>

      <section className="table-panel">
        <div className="table-header">
          <span>Line</span>
          <span>Metric</span>
          <span>Value</span>
          <span>Recorded At</span>
          <span>Source</span>
          <span>Status</span>
        </div>
        {snapshot.points.map((point) => (
          <div key={point.id} className="table-row">
            <div>{point.lineId}</div>
            <div>{point.metric}</div>
            <div>{point.value}</div>
            <div>{new Date(point.recordedAt).toLocaleString("en-US")}</div>
            <div>{snapshot.source}</div>
            <div>
              <span className="pill pill-positive">tracked</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
