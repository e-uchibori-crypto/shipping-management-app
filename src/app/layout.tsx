import "./globals.css";

export const metadata = {
  title: "発注管理・在庫予測システム",
  description: "リードタイムと予実差分を考慮した発注管理ツール"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
