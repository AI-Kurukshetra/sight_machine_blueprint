import { requireAdminPage } from "@/lib/auth";
import { getComplianceSnapshot } from "@/lib/data";

function statusClass(status: "compliant" | "at_risk" | "non_compliant") {
  if (status === "compliant") return "pill-positive";
  if (status === "at_risk") return "pill-warning";
  return "pill-critical";
}

export default async function CompliancePage() {
  await requireAdminPage();
  const snapshot = await getComplianceSnapshot();

  return (
    <div className="stack-xl">
      <section className="page-header">
        <div>
          <p className="eyebrow">Compliance reporting</p>
          <h1>Audit and regulatory posture</h1>
        </div>
        <p className="page-copy">
          Automated compliance status reporting with due dates, ownership, and evidence links.
        </p>
      </section>

      <section className="content-grid">
        {snapshot.entries.map((item) => (
          <article key={item.id} className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">{item.standard}</p>
                <h2>{item.area}</h2>
              </div>
              <span className={`pill ${statusClass(item.status)}`}>{item.status.replace("_", " ")}</span>
            </div>
            <div className="meta-grid">
              <div>
                <span className="eyebrow">Owner</span>
                <strong>{item.owner}</strong>
              </div>
              <div>
                <span className="eyebrow">Due date</span>
                <strong>{new Date(item.dueDate).toLocaleDateString("en-US")}</strong>
              </div>
              <div>
                <span className="eyebrow">Evidence</span>
                <strong>{item.evidenceLink}</strong>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
