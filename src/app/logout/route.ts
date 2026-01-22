import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { clearSessionCookie } from "@/lib/session";
import { recordAudit } from "@/lib/audit";

export async function GET(request: Request) {
  const token = cookies().get("oms_session")?.value;
  let userId: string | null = null;

  if (token) {
    const session = await prisma.session.findUnique({ where: { token } });
    if (session) {
      userId = session.userId;
      await prisma.session.delete({ where: { id: session.id } });
    }
  }

  clearSessionCookie();

  if (userId) {
    await recordAudit({
      userId,
      action: "LOGOUT",
      entityType: "session",
      reason: "ユーザーがログアウト"
    });
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
