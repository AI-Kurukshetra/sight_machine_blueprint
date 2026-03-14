import { getGenealogySnapshot } from "@/lib/data";

function qualityClass(status: "pass" | "hold" | "fail") {
  if (status === "pass") return "pill-positive";
  if (status === "hold") return "pill-warning";
  return "pill-critical";
}

export default async function GenealogyPage() {
  const snapshot = await getGenealogySnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Equipment genealogy</p>
          <h1>Batch lineage and traceability</h1>
        </div>
        <p className="page-copy">
          End-to-end batch genealogy across equipment path for quality traceability and recall readiness.
        </p>
      </section>

      <section className="stack-md">
        {snapshot.records.map((item) => (
          <article key={item.id} className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">{item.batchCode}</p>
                <h2>{item.product}</h2>
              </div>
              <span className={`pill ${qualityClass(item.qualityStatus)}`}>{item.qualityStatus}</span>
            </div>
            <p>Parent batch: {item.parentBatch}</p>
            <p>{item.equipmentPath}</p>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">Started</span>
                <strong>{new Date(item.startedAt).toLocaleString("en-US")}</strong>
              </div>
              <div>
                <span className="eyebrow">Completed</span>
                <strong>{new Date(item.completedAt).toLocaleString("en-US")}</strong>
              </div>
              <div>
                <span className="eyebrow">Trace state</span>
                <strong>linked</strong>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
