import bcrypt from "bcryptjs";
import { PrismaClient, MetricCategory, MetricDirection } from "@prisma/client";

const prisma = new PrismaClient();

const metricSeeds = [
  { key: "opening_stock", label: "前月末在庫", category: MetricCategory.INVENTORY, direction: MetricDirection.BALANCE },
  { key: "inbound", label: "当月IN台数", category: MetricCategory.INBOUND, direction: MetricDirection.IN },
  { key: "cancel_return", label: "キャンセル戻り", category: MetricCategory.INBOUND, direction: MetricDirection.IN },
  { key: "out_maintenance", label: "メンテ", category: MetricCategory.OUTBOUND, direction: MetricDirection.OUT },
  { key: "out_switch_plan", label: "切替(想定)", category: MetricCategory.OUTBOUND, direction: MetricDirection.OUT },
  { key: "out_switch_sales", label: "切替(営業案件)", category: MetricCategory.OUTBOUND, direction: MetricDirection.OUT },
  { key: "out_new", label: "新規/追加/その他", category: MetricCategory.OUTBOUND, direction: MetricDirection.OUT },
  { key: "out_other", label: "その他", category: MetricCategory.OUTBOUND, direction: MetricDirection.OUT },
  { key: "out_total", label: "当月OUT台数", category: MetricCategory.OUTBOUND, direction: MetricDirection.OUT, isEditable: false },
  { key: "variance_total", label: "差数(合算)", category: MetricCategory.VARIANCE, direction: MetricDirection.BALANCE, isEditable: false },
  { key: "ending_stock", label: "当月末在庫", category: MetricCategory.INVENTORY, direction: MetricDirection.BALANCE, isEditable: false },
  { key: "order_qty", label: "当月発注台数", category: MetricCategory.INBOUND, direction: MetricDirection.IN },
  { key: "unit_cost", label: "仕入単価", category: MetricCategory.FINANCE, direction: MetricDirection.BALANCE },
  { key: "amount", label: "金額", category: MetricCategory.FINANCE, direction: MetricDirection.BALANCE, isEditable: false }
];

async function main() {
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin1234";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: { displayName: "管理者", passwordHash, role: "admin" },
    create: { username: "admin", displayName: "管理者", passwordHash, role: "admin" }
  });

  await prisma.location.upsert({
    where: { code: "TCS" },
    update: { name: "TCS" },
    create: { code: "TCS", name: "TCS" }
  });

  await prisma.location.upsert({
    where: { code: "NIKKO" },
    update: { name: "日光精器" },
    create: { code: "NIKKO", name: "日光精器" }
  });

  for (const metric of metricSeeds) {
    await prisma.metricDefinition.upsert({
      where: { key: metric.key },
      update: { label: metric.label, category: metric.category, direction: metric.direction, isEditable: metric.isEditable ?? true },
      create: {
        key: metric.key,
        label: metric.label,
        category: metric.category,
        direction: metric.direction,
        isEditable: metric.isEditable ?? true
      }
    });
  }

  await prisma.product.upsert({
    where: { code: "NEX-E" },
    update: { name: "NEX-E", leadTimeMonths: 3, targetStock: 12000, usesDualLocation: true },
    create: { code: "NEX-E", name: "NEX-E", leadTimeMonths: 3, targetStock: 12000, usesDualLocation: true }
  });

  await prisma.product.upsert({
    where: { code: "NEX-C" },
    update: { name: "NEX-C (据置)", leadTimeMonths: 3, targetStock: 1000, usesDualLocation: false },
    create: { code: "NEX-C", name: "NEX-C (据置)", leadTimeMonths: 3, targetStock: 1000, usesDualLocation: false }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
