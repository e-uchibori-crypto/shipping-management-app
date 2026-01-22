import { loginAction } from "./actions";

export default function LoginPage() {
  return (
    <main className="login-page">
      <form className="login-card" action={loginAction}>
        <h2>発注管理システム ログイン</h2>
        <p>IDとパスワードでログインしてください。</p>
        <label htmlFor="username">ユーザーID</label>
        <input id="username" name="username" type="text" required autoComplete="username" />
        <label htmlFor="password">パスワード</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" />
        <button className="button primary" type="submit">
          ログイン
        </button>
        <p className="hint" style={{ marginTop: 12 }}>
          初期管理者は seed 実行で作成されます。
        </p>
      </form>
    </main>
  );
}
