import { getSpcSnapshot } from "@/lib/data";

function statusClass(status: "in_control" | "warning" | "out_of_control") {
  if (status === "in_control") return "pill-positive";
  if (status === "warning") return "pill-warning";
  return "pill-critical";
}

export default async function SpcPage() {
  const snapshot = await getSpcSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Statistical process control</p>
          <h1>SPC sample monitoring</h1>
        </div>
        <p className="page-copy">
          Control limit tracking for critical process parameters with early drift detection.
        </p>
      </section>

      <section className="table-panel">
        <div className="table-header">
          <span>Line</span>
          <span>Parameter</span>
          <span>Sample</span>
          <span>Control Band</span>
          <span>Time</span>
          <span>Status</span>
        </div>
        {snapshot.samples.map((item) => (
          <div key={item.id} className="table-row">
            <div>{item.lineId}</div>
            <div>{item.parameter}</div>
            <div>{item.sampleValue}</div>
            <div>
              {item.lcl} - {item.ucl}
            </div>
            <div>{new Date(item.sampledAt).toLocaleTimeString("en-US")}</div>
            <div>
              <span className={`pill ${statusClass(item.status)}`}>{item.status.replace("_", " ")}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
