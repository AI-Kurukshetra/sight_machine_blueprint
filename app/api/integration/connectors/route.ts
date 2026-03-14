import { NextResponse } from "next/server";

import { isCurrentUserAdmin } from "@/lib/auth";
import { getConnectSnapshot } from "@/lib/data";

export async function GET() {
  if (!(await isCurrentUserAdmin())) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const snapshot = await getConnectSnapshot();

  return NextResponse.json({
    source: snapshot.source,
    data: snapshot.connectors,
  });
}
