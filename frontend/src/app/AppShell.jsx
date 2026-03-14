import { Link, Outlet } from "react-router-dom";

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          meflix
        </Link>
        <nav className="topnav">
          <Link to="/">Home</Link>
          <Link to="/quiz">Criar a minha</Link>
          <Link to="/preview/demo">Preview</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
