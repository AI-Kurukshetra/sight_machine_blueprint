import { getPlanningSnapshot } from "@/lib/data";

function statusClass(status: "scheduled" | "in_progress" | "delayed" | "completed") {
  if (status === "completed") return "pill-positive";
  if (status === "in_progress") return "pill-running";
  if (status === "scheduled") return "pill-warning";
  return "pill-critical";
}

export default async function PlanningPage() {
  const snapshot = await getPlanningSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Production planning integration</p>
          <h1>ERP/MES execution schedule</h1>
        </div>
        <p className="page-copy">
          Work-order aware planning board for line assignment, target units, and schedule adherence.
        </p>
      </section>

      <section className="content-grid">
        {snapshot.plans.map((plan) => (
          <article key={plan.id} className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">{plan.workOrder}</p>
                <h2>{plan.product}</h2>
              </div>
              <span className={`pill ${statusClass(plan.status)}`}>{plan.status.replace("_", " ")}</span>
            </div>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">Assigned line</span>
                <strong>{plan.assignedLine}</strong>
              </div>
              <div>
                <span className="eyebrow">Target units</span>
                <strong>{plan.targetUnits}</strong>
              </div>
              <div>
                <span className="eyebrow">Window</span>
                <strong>
                  {new Date(plan.plannedStart).toLocaleTimeString("en-US")} -{" "}
                  {new Date(plan.plannedEnd).toLocaleTimeString("en-US")}
                </strong>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
