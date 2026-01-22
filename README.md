# 発注管理・在庫予測システム（初期構成）

スプレッドシート運用から脱却し、リードタイム・予実差分・操作履歴を統合した発注管理システムの土台です。

## 概要

- **ログイン画面**：ID/パスワードによる認証（セッション管理）
- **メイン画面**：年月が横に伸びるマトリックス UI（9ヶ月先まで）
- **データ設計**：予実管理・差数・操作履歴・会議コメントを保存可能な Prisma スキーマ

## セットアップ

```bash
npm install
cp .env.example .env
npm run prisma:migrate
npm run db:seed
npm run dev
```

初期ユーザー:

- ID: `admin`
- PASS: `admin1234`（`SEED_ADMIN_PASSWORD` で変更可能）

## 画面構成

- `/login` : ログイン画面
- `/` : マトリックス UI（サンプルデータ）
- `/logout` : ログアウト

## DB設計（概要）

- **User / Session**: ID・パスワード認証＋セッション管理
- **MetricDefinition / MetricValue**: 管理項目定義と月次値（予測/実績）
- **ForecastSnapshot**: 実績入力時に上書き前の予測値を保存
- **AuditLog**: 変更履歴（誰が・いつ・何を・どう変えたか）
- **MeetingNote**: 会議モードでの修正理由や決定メモ

## 次のステップ

- 予実入力フォームと差数の自動計算
- AI発注提案ロジック（リードタイム/適正在庫/前年比較/乖離傾向）
- 履歴検索・フィルタUIとCSV/JSONインポート機能
