import { requireAdminPage } from "@/lib/auth";
import { getInnovationIdeaSnapshot } from "@/lib/data";

function readinessClass(readiness: "concept" | "prototype" | "validated") {
  if (readiness === "validated") return "pill-positive";
  if (readiness === "prototype") return "pill-warning";
  return "pill-critical";
}

export default async function InnovationLabPage() {
  await requireAdminPage();
  const snapshot = await getInnovationIdeaSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Innovation lab</p>
          <h1>Beyond-market strategic bets</h1>
        </div>
        <p className="page-copy">
          Pipeline of frontier ideas prioritized by impact score, execution horizon, and readiness.
        </p>
      </section>

      <section className="table-panel">
        <div className="table-header">
          <span>Idea</span>
          <span>Summary</span>
          <span>Impact</span>
          <span>Horizon</span>
          <span>Readiness</span>
          <span>Source</span>
        </div>
        {snapshot.ideas.map((idea) => (
          <div key={idea.id} className="table-row">
            <div>{idea.title}</div>
            <div>{idea.summary}</div>
            <div>{idea.impactScore}</div>
            <div>{idea.horizon.replace("_", " ")}</div>
            <div>
              <span className={`pill ${readinessClass(idea.readiness)}`}>{idea.readiness}</span>
            </div>
            <div>{snapshot.source}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
