"use server";

import { redirect } from "next/navigation";
import { authenticateUser, createSession } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";
import { recordAudit } from "@/lib/audit";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    redirect("/login");
  }

  const user = await authenticateUser(username, password);
  if (!user) {
    redirect("/login");
  }

  const { token, expiresAt } = await createSession(user.id);
  setSessionCookie(token, expiresAt);
  await recordAudit({
    userId: user.id,
    action: "LOGIN",
    entityType: "session",
    entityId: null,
    field: null,
    beforeValue: null,
    afterValue: null,
    reason: "ユーザーがログイン",
    metadata: { username: user.username }
  });

  redirect("/");
}
