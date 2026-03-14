import { requireAdminPage } from "@/lib/auth";
import { getConnectSnapshot } from "@/lib/data";

export default async function ConnectPage() {
  await requireAdminPage();
  const snapshot = await getConnectSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Connect</p>
          <h1>Data connector health</h1>
        </div>
        <p className="page-copy">
          Monitor factory ingestion pathways across protocols and sites. This closes the biggest MVP gap
          against enterprise-grade data-platform positioning.
        </p>
      </section>

      <section className="integration-grid">
        {snapshot.connectors.map((connector) => (
          <article key={connector.id} className="panel integration-card">
            <div className="panel-head">
              <div>
                <p className="eyebrow">{connector.protocol}</p>
                <h2>{connector.name}</h2>
              </div>
              <span className={`pill pill-connector-${connector.status}`}>{connector.status}</span>
            </div>
            <p>{connector.notes}</p>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">Latency</span>
                <strong>{connector.latencyMs} ms</strong>
              </div>
              <div>
                <span className="eyebrow">Records/min</span>
                <strong>{connector.recordsPerMin}</strong>
              </div>
              <div>
                <span className="eyebrow">Last ingest</span>
                <strong>{new Date(connector.lastIngestedAt).toLocaleString("en-US")}</strong>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
