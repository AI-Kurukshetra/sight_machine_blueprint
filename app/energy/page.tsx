import { getEnergySnapshot } from "@/lib/data";

export default async function EnergyPage() {
  const snapshot = await getEnergySnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Energy monitoring</p>
          <h1>Consumption and intensity tracking</h1>
        </div>
        <p className="page-copy">
          Track facility and line-level energy signals to identify optimization opportunities.
        </p>
      </section>

      <section className="content-grid">
        {snapshot.records.map((record) => (
          <article key={record.id} className="panel">
            <p className="eyebrow">{record.facilityId}</p>
            <h2>{record.lineId}</h2>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">kWh</span>
                <strong>{record.kwh}</strong>
              </div>
              <div>
                <span className="eyebrow">Intensity</span>
                <strong>{record.intensityKwhPerUnit} kWh/unit</strong>
              </div>
              <div>
                <span className="eyebrow">Peak</span>
                <strong>{record.peakKw} kW</strong>
              </div>
            </div>
            <p>Recorded {new Date(record.recordedAt).toLocaleString("en-US")}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
