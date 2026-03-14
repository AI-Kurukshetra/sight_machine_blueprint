import { getDashboardSnapshot } from "@/lib/data";
import { formatPercent } from "@/lib/utils";

export default async function EquipmentPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Equipment intelligence</p>
          <h1>Live asset register</h1>
        </div>
        <p className="page-copy">
          Combine health score, energy draw, utilization, and digital twin state in one operator view.
        </p>
      </section>

      <section className="table-panel">
        <div className="table-header">
          <span>Asset</span>
          <span>Line</span>
          <span>Status</span>
          <span>Health</span>
          <span>Utilization</span>
          <span>Energy</span>
        </div>
        {snapshot.equipment.map((item) => (
          <div key={item.id} className="table-row">
            <div>
              <strong>{item.name}</strong>
              <p>{item.type}</p>
            </div>
            <div>{snapshot.productionLines.find((line) => line.id === item.lineId)?.name ?? item.lineId}</div>
            <div>
              <span className={`pill pill-${item.status === "warning" ? "attention" : item.status}`}>
                {item.status}
              </span>
            </div>
            <div>{formatPercent(item.healthScore, 0)}</div>
            <div>{formatPercent(item.utilization, 0)}</div>
            <div>{item.energyKw} kW</div>
          </div>
        ))}
      </section>

      <section className="content-grid">
        {snapshot.equipment.map((item) => (
          <article key={item.id} className="panel">
            <p className="eyebrow">{item.type}</p>
            <h2>{item.name}</h2>
            <div className="stack-sm">
              <div className="progress-block">
                <span>Health</span>
                <div className="progress-bar">
                  <div style={{ width: `${item.healthScore}%` }} />
                </div>
              </div>
              <div className="progress-block">
                <span>Utilization</span>
                <div className="progress-bar subtle">
                  <div style={{ width: `${item.utilization}%` }} />
                </div>
              </div>
            </div>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">Digital twin</span>
                <strong>{item.digitalTwinState}</strong>
              </div>
              <div>
                <span className="eyebrow">Last service</span>
                <strong>{new Date(item.lastService).toLocaleDateString("en-US")}</strong>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
