import Link from "next/link";
import { requireUser } from "@/lib/session";
import { buildMonths, getSampleMatrices, MatrixRow, MonthColumn } from "@/lib/sampleData";

const numberFormatter = new Intl.NumberFormat("ja-JP");

function formatNumber(value: number | undefined) {
  if (value === undefined) return "-";
  return numberFormatter.format(value);
}

function rowClass(kind: MatrixRow["kind"]) {
  if (kind === "total") return "total";
  if (kind === "forecast") return "forecast";
  if (kind === "actual") return "actual";
  if (kind === "variance") return "variance";
  if (kind === "section") return "section-label";
  return "";
}

function MatrixTable({ months, rows }: { months: MonthColumn[]; rows: MatrixRow[] }) {
  return (
    <div className="matrix-wrapper">
      <table className="matrix-table">
        <thead>
          <tr>
            <th className="row-label">管理項目</th>
            {months.map((month) => (
              <th key={month.id}>{month.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td className={`row-label ${rowClass(row.kind)}`}>{row.label}</td>
              {months.map((month, index) => (
                <td key={`${row.key}-${month.id}`} className={rowClass(row.kind)}>
                  {row.kind === "section" ? "" : formatNumber(row.values[index])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function HomePage() {
  const user = await requireUser();
  const months = buildMonths(new Date(), 9);
  const matrices = getSampleMatrices();

  return (
    <main className="page">
      <section className="panel topbar">
        <div>
          <h1>発注管理・在庫予測ダッシュボード</h1>
          <p className="hint">リードタイム3ヶ月を考慮した予実管理とAI発注提案</p>
        </div>
        <div className="user">
          <span className="badge">ログイン中: {user.displayName}</span>
          <Link className="button" href="/logout">
            ログアウト
          </Link>
        </div>
      </section>

      <section className="panel controls">
        <div className="split">
          <div className="controls">
            <span className="tag">会議モード: オフ</span>
            <button className="button warning" type="button">
              会議モードへ切替
            </button>
            <button className="button" type="button">
              CSV/JSON インポート
            </button>
          </div>
          <div className="controls">
            <label className="hint">型番</label>
            <button className="button" type="button">
              全て
            </button>
            <label className="hint">期間</label>
            <button className="button" type="button">
              直近9ヶ月
            </button>
          </div>
        </div>
      </section>

      {matrices.map((matrix) => (
        <section key={matrix.productCode} className="panel">
          <div className="split">
            <div>
              <h2>
                {matrix.displayName} <span className="hint">({matrix.productCode})</span>
              </h2>
              <p className="hint">
                リードタイム {matrix.leadTimeMonths}ヶ月 / 適正在庫 {matrix.targetStock} 台
              </p>
            </div>
            <div className="controls">
              {matrix.usesDualLocation ? <span className="tag">2拠点在庫</span> : <span className="tag">単拠点</span>}
            </div>
          </div>
          <div className="list">
            <div className="note">
              {matrix.notes.map((note) => (
                <div key={note}>・{note}</div>
              ))}
            </div>
            <MatrixTable months={months} rows={matrix.rows} />
          </div>

          <div className="grid-2">
            <div className="list">
              <div className="list-item">
                <strong>AI仮発注提案</strong>
                <span className="meta">3ヶ月後の在庫を基準に、適正在庫を下回らないよう算出</span>
                <div>提案発注数: 2,000台（{months[2]?.label} 入庫想定）</div>
                <ul className="hint">
                  <li>前年差: -120台の季節要因を反映</li>
                  <li>直近乖離: -80台が継続傾向</li>
                  <li>適正在庫 12,000台を下回らない水準で補正</li>
                </ul>
              </div>
              <div className="list-item">
                <strong>会議中の修正メモ</strong>
                <span className="meta">会議モードを有効化すると編集コメントが記録されます</span>
                <textarea
                  rows={4}
                  placeholder="会議で合意した修正理由を入力"
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    padding: 8,
                    fontSize: 13
                  }}
                />
              </div>
            </div>
            <div className="list">
              <div className="list-item">
                <strong>直近の操作履歴</strong>
                <span className="meta">誰が・いつ・何を変更したかを記録</span>
                <div className="hint">2026/01/22 09:12 | 山田 | NEX-E | 予測出荷 ②切替を 1,600 → 1,500</div>
                <div className="hint">2026/01/21 18:05 | 佐藤 | NEX-C | 実績入力を確定（差数 +36）</div>
                <div className="hint">2026/01/21 10:22 | 田中 | ログイン</div>
              </div>
              <div className="list-item">
                <strong>検索・フィルタ</strong>
                <span className="meta">型番・期間・項目を指定して履歴を抽出</span>
                <div className="controls">
                  <button className="button" type="button">
                    型番で絞り込む
                  </button>
                  <button className="button" type="button">
                    差数のみ表示
                  </button>
                  <button className="button" type="button">
                    操作履歴を開く
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
