import { prisma } from "./db";

type AuditPayload = {
  userId: string | null;
  action: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE" | "IMPORT" | "MEETING_ADJUST";
  entityType: string;
  entityId?: string | null;
  field?: string | null;
  beforeValue?: string | null;
  afterValue?: string | null;
  reason?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function recordAudit(payload: AuditPayload) {
  await prisma.auditLog.create({
    data: {
      userId: payload.userId,
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId ?? null,
      field: payload.field ?? null,
      beforeValue: payload.beforeValue ?? null,
      afterValue: payload.afterValue ?? null,
      reason: payload.reason ?? null,
      metadata: payload.metadata ?? null
    }
  });
}
