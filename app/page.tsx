import Link from "next/link";

import { getDashboardSnapshot } from "@/lib/data";
import { formatPercent } from "@/lib/utils";

export default async function HomePage() {
  const snapshot = await getDashboardSnapshot();
  const averageOee =
    snapshot.productionLines.reduce((sum, line) => sum + line.oee, 0) / Math.max(snapshot.productionLines.length, 1);
  const openAlerts = snapshot.alerts.filter((item) => item.status !== "resolved").length;
  const dueMaintenance = snapshot.maintenance.filter((item) => item.daysUntilService <= 3).length;
  const totalThroughput = snapshot.productionLines.reduce((sum, line) => sum + line.throughput, 0);

  const platformLayers = [
    {
      title: "Connect",
      copy: "Ingest and stream OT + IT factory data in real time across machines, lines, and plants.",
      href: "/connect",
    },
    {
      title: "Structure",
      copy: "Transform raw plant signals into one standardized operational model for every process.",
      href: "/digital-twin",
    },
    {
      title: "Analyze",
      copy: "Use AI insights, simulation, and diagnostics to find bottlenecks and prevent failures.",
      href: "/analytics",
    },
    {
      title: "Operate",
      copy: "Put guidance into operator workflows with live alerts, handovers, and action loops.",
      href: "/mobile",
    },
    {
      title: "Build",
      copy: "Extend operations fast with configurable KPI, optimization, and compliance applications.",
      href: "/kpis",
    },
  ];

  return (
    <div className="stack-xl home-shell">
      <section className="home-hero">
        <div>
          <p className="eyebrow home-kicker">Industrial AI platform</p>
          <h1>Industrial transformation at AI speed.</h1>
          <p className="hero-copy">
            SightOps brings a unified manufacturing intelligence stack to the factory floor in weeks,
            connecting data, standardizing context, and activating AI decisions across operations.
          </p>
          <div className="home-cta-row">
            <Link href="/admin" className="button">
              See Platform Demo
            </Link>
            <Link href="/sites" className="button button-secondary">
              Explore Sites
            </Link>
          </div>
        </div>
        <div className="home-hero-card">
          <div className="signal-card">
            <span className={`pill ${snapshot.source === "supabase" ? "pill-positive" : "pill-warning"}`}>
              {snapshot.source === "supabase" ? "Live source" : "Demo source"}
            </span>
            <strong>{snapshot.facility.name}</strong>
            <span>{snapshot.facility.location}</span>
            <span>{snapshot.facility.shift}</span>
            <div className="home-mini-stats">
              <div>
                <span className="eyebrow">Avg OEE</span>
                <strong>{formatPercent(averageOee)}</strong>
              </div>
              <div>
                <span className="eyebrow">Throughput</span>
                <strong>{totalThroughput}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-proof">
        <p className="eyebrow">Trusted by transformation-focused plant teams</p>
        <div className="home-proof-grid">
          <span>Automotive</span>
          <span>Packaging</span>
          <span>Chemicals</span>
          <span>Food & Beverage</span>
          <span>Electronics</span>
        </div>
      </section>

      <section className="metric-grid home-metrics">
        {snapshot.summary.slice(0, 4).map((item) => (
          <article key={item.label} className="metric-card">
            <span className="eyebrow">{item.label}</span>
            <strong>{item.value}</strong>
            <span className={`metric-change metric-${item.tone}`}>{item.change}</span>
          </article>
        ))}
      </section>

      <section id="platform" className="home-section-head">
        <p className="eyebrow">From connection to optimization</p>
        <h2>AI for every step of manufacturing performance</h2>
      </section>

      <section className="home-layer-grid">
        {platformLayers.map((layer) => (
          <article key={layer.title} className="home-layer-card">
            <p className="eyebrow">{layer.title}</p>
            <h3>{layer.title} Layer</h3>
            <p>{layer.copy}</p>
            <Link href={layer.href} className="text-link">
              Explore {layer.title}
            </Link>
          </article>
        ))}
      </section>

      <section id="outcomes" className="home-section-head">
        <p className="eyebrow">Transformational outcomes</p>
        <h2>Operational results at enterprise scale</h2>
      </section>

      <section className="home-outcome-grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Production</p>
              <h2>{totalThroughput}</h2>
            </div>
            <span className="pill pill-positive">units/hr</span>
          </div>
          <p>Network throughput across active production lines with AI-assisted balancing.</p>
        </article>
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Quality</p>
              <h2>{formatPercent(averageOee)}</h2>
            </div>
            <span className="pill pill-warning">avg OEE</span>
          </div>
          <p>Continuous optimization improves yield stability and throughput predictability.</p>
        </article>
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Reliability</p>
              <h2>{dueMaintenance}</h2>
            </div>
            <span className="pill pill-critical">due soon</span>
          </div>
          <p>Maintenance interventions prioritized by confidence and operational impact.</p>
        </article>
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Risk</p>
              <h2>{openAlerts}</h2>
            </div>
            <span className="pill pill-warning">open alerts</span>
          </div>
          <p>Escalations routed fast with context from digital twins and anomaly intelligence.</p>
        </article>
      </section>

      <section id="use-cases" className="home-section-head">
        <p className="eyebrow">Use cases</p>
        <h2>Solve manufacturing’s highest-impact problems</h2>
      </section>

      <section className="home-usecase-grid">
        <article className="home-usecase-card">
          <h3>Throughput</h3>
          <p>Increase rate of production and remove micro-stoppages across constrained assets.</p>
          <Link href="/planning" className="text-link">
            View planning
          </Link>
        </article>
        <article className="home-usecase-card">
          <h3>Quality</h3>
          <p>Raise first-pass yield, reduce scrap, and identify root cause in near real time.</p>
          <Link href="/quality" className="text-link">
            View quality
          </Link>
        </article>
        <article className="home-usecase-card">
          <h3>Cost & Energy</h3>
          <p>Reduce unit cost with predictive maintenance and operational energy intelligence.</p>
          <Link href="/energy" className="text-link">
            View energy
          </Link>
        </article>
        <article className="home-usecase-card">
          <h3>Sustainability</h3>
          <p>Track carbon and material impact while improving delivery performance and uptime.</p>
          <Link href="/compliance" className="text-link">
            View compliance
          </Link>
        </article>
      </section>

      <section className="home-cta-panel">
        <p className="eyebrow">Getting started is easy</p>
        <h2>See how SightOps can transform your factory operations in weeks.</h2>
        <div className="home-cta-row">
          <Link href="/auth" className="button">
            Schedule Demo Flow
          </Link>
          <Link href="/admin" className="button button-secondary">
            Open Admin Center
          </Link>
        </div>
      </section>
    </div>
  );
}
