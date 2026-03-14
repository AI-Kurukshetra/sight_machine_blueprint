import { NextResponse } from "next/server";

import { getDashboardSnapshot } from "@/lib/data";

export async function GET() {
  const snapshot = await getDashboardSnapshot();

  return NextResponse.json({
    source: snapshot.source,
    data: {
      factory: snapshot.summary.find((item) => item.label === "Factory OEE")?.value ?? null,
      lines: snapshot.productionLines.map((line) => ({
        lineId: line.id,
        lineName: line.name,
        oee: line.oee,
      })),
    },
  });
}
