import { getDashboardSnapshot } from "@/lib/data";

export default async function DigitalTwinPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Digital twin</p>
          <h1>Factory state mirror</h1>
        </div>
        <p className="page-copy">
          A simplified digital twin view that keeps operator attention on current machine state and drift.
        </p>
      </section>

      <section className="panel">
        <div className="twin-grid">
          {snapshot.equipment.map((item) => (
            <article key={item.id} className={`twin-node twin-${item.status}`}>
              <span className="eyebrow">{item.type}</span>
              <strong>{item.name}</strong>
              <p>{item.digitalTwinState}</p>
              <div className="twin-meta">
                <span>Health {item.healthScore}%</span>
                <span>{item.energyKw} kW</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
