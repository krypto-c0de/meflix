import { Link, NavLink, Outlet } from "react-router-dom";

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-me">me</span>
          <span className="brand-flix">.flix</span>
        </Link>
        <nav className="topnav">
          <NavLink to="/" end className={({ isActive }) => `topnav-link${isActive ? " active" : ""}`}>
            Home
          </NavLink>
          <a href="/#como-funciona" className="topnav-link">
            Como funciona
          </a>
        </nav>
        <div className="topbar-actions">
          <Link to="/quiz" className="btn-nav-cta">
            Criar a minha →
          </Link>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
