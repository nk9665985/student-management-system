import { NavLink } from "react-router-dom";
import { LayoutGrid, Search, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { username, logout } = useAuth();
  const initial = (username || "?").charAt(0).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">SMS</span>
        <span className="brand-name">Transcript Console</span>
      </div>

      <nav className="nav">
        <NavLink to="/students" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <LayoutGrid size={16} /> Students
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <Search size={16} /> Search
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <span className="user-avatar">{initial}</span>
          <span className="user-name">{username}</span>
        </div>
        <button className="btn btn-ghost btn-block" onClick={logout}>
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </aside>
  );
}
