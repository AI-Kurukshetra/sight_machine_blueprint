import Link from "next/link";

import { requireAdminPage } from "@/lib/auth";
import { getConnectSnapshot, getKpiSnapshot, getOptimizationSnapshot } from "@/lib/data";

export default async function AdminPage() {
  await requireAdminPage();

  const [connectors, kpis, optimization] = await Promise.all([
    getConnectSnapshot(),
    getKpiSnapshot(),
    getOptimizationSnapshot(),
  ]);

  const healthyConnectors = connectors.connectors.filter((item) => item.status === "healthy").length;
  const activeKpis = kpis.kpis.length;
  const pendingOptimizations = optimization.recommendations.filter((item) => item.status !== "applied").length;

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Admin control center</h1>
        </div>
        <p className="page-copy">
          Restricted workspace for platform-level operations, integrations, and KPI governance.
        </p>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <span className="eyebrow">Connector health</span>
          <strong>
            {healthyConnectors}/{connectors.connectors.length}
          </strong>
          <span className="metric-change metric-positive">Healthy links</span>
        </article>
        <article className="metric-card">
          <span className="eyebrow">Custom KPIs</span>
          <strong>{activeKpis}</strong>
          <span className="metric-change metric-warning">Under governance</span>
        </article>
        <article className="metric-card">
          <span className="eyebrow">Optimization queue</span>
          <strong>{pendingOptimizations}</strong>
          <span className="metric-change metric-warning">Pending rollout</span>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Admin modules</p>
              <h2>Restricted surfaces</h2>
            </div>
          </div>
          <div className="stack-md">
            <Link href="/connect" className="text-link">
              Integration and ingestion connectivity
            </Link>
            <Link href="/kpis" className="text-link">
              KPI formula management
            </Link>
            <Link href="/optimization" className="text-link">
              Optimization rollout controls
            </Link>
            <Link href="/compliance" className="text-link">
              Compliance and audit records
            </Link>
            <Link href="/anomalies" className="text-link">
              Anomaly detection queue
            </Link>
            <Link href="/inventory" className="text-link">
              Inventory and material visibility
            </Link>
            <Link href="/energy" className="text-link">
              Energy and carbon monitoring inputs
            </Link>
            <Link href="/operators" className="text-link">
              Operator analytics
            </Link>
            <Link href="/root-cause" className="text-link">
              Root-cause analysis workbench
            </Link>
            <Link href="/handover" className="text-link">
              Shift handover reports
            </Link>
            <Link href="/genealogy" className="text-link">
              Product genealogy traceability
            </Link>
            <Link href="/spc" className="text-link">
              SPC control monitoring
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
