import { requireAdminPage } from "@/lib/auth";
import { getAdvancedFeatureSnapshot } from "@/lib/data";
import { formatPercent } from "@/lib/utils";
import Link from "next/link";

function priorityClass(priority: "innovative" | "important") {
  return priority === "innovative" ? "pill-warning" : "pill-positive";
}

function statusClass(status: "planned" | "pilot" | "active") {
  if (status === "active") return "pill-positive";
  if (status === "pilot") return "pill-warning";
  return "pill-critical";
}

export default async function AdvancedFeaturesPage() {
  await requireAdminPage();
  const snapshot = await getAdvancedFeatureSnapshot();

  const avgRoi =
    snapshot.modules.reduce((sum, module) => sum + module.roiPercent, 0) /
    Math.max(snapshot.modules.length, 1);
  const avgLatency =
    snapshot.modules.reduce((sum, module) => sum + module.latencyMs, 0) /
    Math.max(snapshot.modules.length, 1);
  const activeCount = snapshot.modules.filter((module) => module.status === "active").length;

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Advanced differentiators</p>
          <h1>AI-first manufacturing capability stack</h1>
        </div>
        <p className="page-copy">
          Operational view across all advanced feature programs: adoption, latency targets, ROI
          projection, and rollout status.
        </p>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <span className="eyebrow">Modules in portfolio</span>
          <strong>{snapshot.modules.length}</strong>
          <span className="metric-change metric-positive">Coverage complete</span>
        </article>
        <article className="metric-card">
          <span className="eyebrow">Active modules</span>
          <strong>{activeCount}</strong>
          <span className="metric-change metric-warning">Live in operations</span>
        </article>
        <article className="metric-card">
          <span className="eyebrow">Average projected ROI</span>
          <strong>{formatPercent(avgRoi)}</strong>
          <span className="metric-change metric-positive">Program outlook</span>
        </article>
        <article className="metric-card">
          <span className="eyebrow">Average decision latency</span>
          <strong>{Math.round(avgLatency)} ms</strong>
          <span className="metric-change metric-warning">Across modules</span>
        </article>
      </section>

      <section className="stack-md">
        {snapshot.modules.map((module) => (
          <article key={module.id} className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">{module.slug}</p>
                <h2>{module.name}</h2>
              </div>
              <div className="line-title">
                <span className={`pill ${priorityClass(module.priority)}`}>{module.priority}</span>
                <span className={`pill ${statusClass(module.status)}`}>{module.status}</span>
              </div>
            </div>
            <p>{module.description}</p>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">Complexity</span>
                <strong>{module.complexity}</strong>
              </div>
              <div>
                <span className="eyebrow">Adoption</span>
                <strong>{formatPercent(module.adoptionPercent, 0)}</strong>
              </div>
              <div>
                <span className="eyebrow">Decision latency</span>
                <strong>{module.latencyMs} ms</strong>
              </div>
              <div>
                <span className="eyebrow">Projected ROI</span>
                <strong>{formatPercent(module.roiPercent)}</strong>
              </div>
            </div>
            <p>{module.recommendation}</p>
            <Link href={`/advanced/${module.slug}`} className="text-link">
              Open feature implementation
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
