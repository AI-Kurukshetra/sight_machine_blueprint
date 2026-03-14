import { getInventorySnapshot } from "@/lib/data";

function statusClass(status: "healthy" | "watch" | "critical") {
  if (status === "healthy") return "pill-positive";
  if (status === "watch") return "pill-warning";
  return "pill-critical";
}

export default async function InventoryPage() {
  const snapshot = await getInventorySnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Inventory tracking</p>
          <h1>Raw, WIP, and finished goods visibility</h1>
        </div>
        <p className="page-copy">
          Monitor stock posture and reorder risk across all inventory classes.
        </p>
      </section>

      <section className="content-grid">
        {snapshot.items.map((item) => (
          <article key={item.id} className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">{item.sku}</p>
                <h2>{item.name}</h2>
              </div>
              <span className={`pill ${statusClass(item.status)}`}>{item.status}</span>
            </div>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">On hand</span>
                <strong>{item.onHand}</strong>
              </div>
              <div>
                <span className="eyebrow">WIP</span>
                <strong>{item.wip}</strong>
              </div>
              <div>
                <span className="eyebrow">Finished</span>
                <strong>{item.finishedGoods}</strong>
              </div>
            </div>
            <p>Reorder point: {item.reorderPoint}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
