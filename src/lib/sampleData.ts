type RowKind = "section" | "data" | "total" | "forecast" | "actual" | "variance";

export type MonthColumn = {
  id: string;
  label: string;
  date: Date;
};

export type MatrixRow = {
  key: string;
  label: string;
  kind: RowKind;
  values: number[];
};

export type ProductMatrix = {
  productCode: string;
  displayName: string;
  leadTimeMonths: number;
  targetStock: number;
  usesDualLocation: boolean;
  rows: MatrixRow[];
  notes: string[];
};

export function buildMonths(start = new Date(), count = 9): MonthColumn[] {
  const base = new Date(start.getFullYear(), start.getMonth(), 1);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(base);
    date.setMonth(base.getMonth() + index);
    return {
      id: `${date.getFullYear()}-${date.getMonth() + 1}`,
      label: `${date.getFullYear()}年${date.getMonth() + 1}月`,
      date
    };
  });
}

function series(values: number[], length = 9) {
  if (values.length === length) return values;
  return Array.from({ length }, (_, index) => values[index] ?? 0);
}

export function getSampleMatrices(): ProductMatrix[] {
  return [
    {
      productCode: "NEX-E",
      displayName: "NEX-E",
      leadTimeMonths: 3,
      targetStock: 12000,
      usesDualLocation: true,
      notes: [
        "入庫・発注は TCS / 日光精器で分割",
        "出荷・在庫は 2社合算で管理"
      ],
      rows: [
        { key: "section-stock", label: "前月末在庫", kind: "section", values: series([]) },
        { key: "opening-stock", label: "前月末在庫", kind: "data", values: series([9323, 15809, 22876, 27259, 37134, 32842, 29040, 28241, 27081]) },
        { key: "section-inbound", label: "当月 IN 台数", kind: "section", values: series([]) },
        { key: "inbound-tcs", label: "当月 IN 台数 (TCS)", kind: "forecast", values: series([9000, 10000, 10000, 15000, 10000, 10000, 10000, 2000, 4000]) },
        { key: "inbound-nikko", label: "当月 IN 台数 (日光精器)", kind: "forecast", values: series([0, 0, 0, 0, 0, 0, 0, 0, 1000]) },
        { key: "section-outbound", label: "当月 OUT 台数（予測）", kind: "section", values: series([]) },
        { key: "out-maint", label: "①メンテ", kind: "forecast", values: series([0, 0, 0, 0, 0, 0, 0, 0, 0]) },
        { key: "out-switch-plan", label: "②切替(想定)", kind: "forecast", values: series([1388, 2487, 3516, 4280, 9807, 12001, 3167, 2221, 1600]) },
        { key: "out-switch-sales", label: "③切替(営業案件)", kind: "forecast", values: series([0, 0, 0, 0, 0, 0, 0, 0, 1000]) },
        { key: "out-new", label: "④新規/追加/その他", kind: "forecast", values: series([1121, 444, 2087, 823, 4458, 1550, 1250, 920, 3000]) },
        { key: "out-other", label: "⑤その他", kind: "forecast", values: series([5, 6, 14, 22, 28, 251, 6382, 19, 0]) },
        { key: "out-total", label: "当月 OUT 台数(①+②+③+④+⑤)", kind: "total", values: series([2514, 2937, 5617, 5125, 14293, 13802, 10799, 3160, 5600]) },
        { key: "section-variance", label: "予実差数（実績入力時に自動算出）", kind: "section", values: series([]) },
        { key: "var-maint", label: "差数_メンテ", kind: "variance", values: series([0, 0, 0, 0, 0, 0, 0, 0, 0]) },
        { key: "var-switch", label: "差数_切替", kind: "variance", values: series([100, -50, 120, -30, 80, -140, 90, -20, 60]) },
        { key: "var-new", label: "差数_新規/追加", kind: "variance", values: series([-80, 60, -40, 20, -90, 40, -60, 10, -30]) },
        { key: "section-inventory", label: "在庫見込み", kind: "section", values: series([]) },
        { key: "ending-stock", label: "当月末在庫", kind: "data", values: series([15809, 22876, 27259, 37134, 32842, 29040, 28241, 27081, 25481]) },
        { key: "order-qty", label: "当月発注台数", kind: "forecast", values: series([15000, 10000, 10000, 10000, 0, 10000, 0, 2000, 1000]) },
        { key: "unit-cost", label: "仕入単価", kind: "data", values: series([4480, 4480, 4480, 4480, 4480, 4480, 4480, 4480, 4480]) },
        { key: "amount", label: "金額", kind: "total", values: series([0, 0, 0, 0, 0, 44800000, 0, 11110000, 4480000]) }
      ]
    },
    {
      productCode: "NEX-C",
      displayName: "NEX-C (据置)",
      leadTimeMonths: 3,
      targetStock: 1000,
      usesDualLocation: false,
      notes: ["入庫は単拠点管理", "出荷は前年比と差数を考慮"],
      rows: [
        { key: "section-stock-c", label: "前月末在庫", kind: "section", values: series([]) },
        { key: "opening-stock-c", label: "前月末在庫", kind: "data", values: series([1021, 1309, 2035, 3270, 5594, 4192, 3449, 2909, 125]) },
        { key: "section-inbound-c", label: "当月 IN 台数", kind: "section", values: series([]) },
        { key: "inbound-total-c", label: "当月 IN 台数", kind: "forecast", values: series([400, 1200, 2000, 3000, 0, 0, 0, 0, 2400]) },
        { key: "section-outbound-c", label: "当月 OUT 台数（予測）", kind: "section", values: series([]) },
        { key: "out-maint-c", label: "①メンテ", kind: "forecast", values: series([73, 0, 0, 0, 0, 0, 0, 0, 200]) },
        { key: "out-switch-c", label: "②切替(想定)", kind: "forecast", values: series([0, 197, 536, 624, 909, 645, 431, 258, 200]) },
        { key: "out-sales-c", label: "③切替(営業案件)", kind: "forecast", values: series([0, 0, 0, 0, 0, 0, 0, 0, 10]) },
        { key: "out-new-c", label: "④新規/追加/その他", kind: "forecast", values: series([19, 236, 229, 49, 472, 97, 107, 126, 250]) },
        { key: "out-other-c", label: "⑤その他", kind: "forecast", values: series([20, 41, 0, 3, 21, 2, 2, 2400, 0]) },
        { key: "out-total-c", label: "当月 OUT 台数(①+②+③+④+⑤)", kind: "total", values: series([112, 474, 765, 676, 1402, 744, 540, 2784, 460]) },
        { key: "section-variance-c", label: "予実差数（直近乖離）", kind: "section", values: series([]) },
        { key: "var-total-c", label: "差数_合算", kind: "variance", values: series([81, 36, 129, 51, 372, 353, 7, 26, 0]) },
        { key: "ending-stock-c", label: "当月末在庫", kind: "data", values: series([1309, 2035, 3270, 5594, 4192, 3449, 2909, 125, 2065]) },
        { key: "order-qty-c", label: "当月発注台数", kind: "forecast", values: series([3000, 0, 0, 0, 0, 0, 0, 0, 120]) },
        { key: "unit-cost-c", label: "仕入単価", kind: "data", values: series([12000, 12000, 12000, 12000, 12000, 12000, 12000, 12000, 12000]) },
        { key: "amount-c", label: "金額", kind: "total", values: series([36000000, 0, 0, 0, 0, 0, 0, 0, 1440000]) }
      ]
    }
  ];
}
