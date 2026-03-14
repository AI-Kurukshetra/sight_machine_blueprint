import { getSitesSnapshot } from "@/lib/data";
import { formatNumber, formatPercent } from "@/lib/utils";

export default async function SitesPage() {
  const snapshot = await getSitesSnapshot();
  const totalThroughput = snapshot.sites.reduce((sum, site) => sum + site.throughput, 0);
  const averageOee =
    snapshot.sites.reduce((sum, site) => sum + site.oee, 0) / Math.max(snapshot.sites.length, 1);

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Multi-site operations</p>
          <h1>Network performance view</h1>
        </div>
        <p className="page-copy">
          Compare throughput, OEE, and active risk across facilities from one operational cockpit.
        </p>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <span className="eyebrow">Sites monitored</span>
          <strong>{snapshot.sites.length}</strong>
          <span className="metric-change metric-positive">Cross-site visibility enabled</span>
        </article>
        <article className="metric-card">
          <span className="eyebrow">Network OEE</span>
          <strong>{formatPercent(averageOee)}</strong>
          <span className="metric-change metric-warning">Focus low-performing sites first</span>
        </article>
        <article className="metric-card">
          <span className="eyebrow">Total Throughput</span>
          <strong>{formatNumber(totalThroughput)}</strong>
          <span className="metric-change metric-positive">Per hour across all locations</span>
        </article>
        <article className="metric-card">
          <span className="eyebrow">Open escalations</span>
          <strong>{snapshot.sites.reduce((sum, site) => sum + site.openAlerts, 0)}</strong>
          <span className="metric-change metric-critical">Requires active triage</span>
        </article>
      </section>

      <section className="site-grid">
        {snapshot.sites.map((site) => (
          <article key={site.facilityId} className="panel site-card">
            <div className="panel-head">
              <div>
                <p className="eyebrow">{site.location}</p>
                <h2>{site.facilityName}</h2>
              </div>
              <span className={`pill pill-site-${site.status}`}>{site.status}</span>
            </div>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">Lines</span>
                <strong>{site.lineCount}</strong>
              </div>
              <div>
                <span className="eyebrow">OEE</span>
                <strong>{formatPercent(site.oee)}</strong>
              </div>
              <div>
                <span className="eyebrow">Throughput</span>
                <strong>{formatNumber(site.throughput)}</strong>
              </div>
            </div>
            <p>
              {site.openAlerts} open alerts currently mapped to this site across connected production assets.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
