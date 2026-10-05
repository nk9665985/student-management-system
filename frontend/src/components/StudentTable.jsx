import { FolderKanban, Pencil, Trash2, Inbox } from "lucide-react";

function initials(first, last) {
  return `${(first || "?").charAt(0)}${(last || "").charAt(0)}`.toUpperCase();
}

function formatDate(iso) {
  if (!iso) return "\u2014";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function StudentTable({ students, loading, emptyMessage, onEdit, onDelete, onOpenProjects }) {
  if (loading) {
    return (
      <table className="ledger-table">
        <tbody>
          {[...Array(4)].map((_, i) => (
            <tr key={i} className="skeleton-row">
              <td colSpan={6}><div className="skeleton-bar" style={{ width: "100%" }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="empty-state">
        <Inbox size={28} className="empty-state-icon" />
        <div>{emptyMessage || "No students found."}</div>
      </div>
    );
  }

  return (
    <table className="ledger-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Index</th>
          <th>Date of birth</th>
          <th>Funding</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s.id}>
            <td>
              <div className="student-cell">
                <span className="avatar-seal">{initials(s.firstName, s.lastName)}</span>
                <div>
                  <div className="student-name">{s.firstName} {s.lastName}</div>
                  <div className="student-meta">{s.email}</div>
                </div>
              </div>
            </td>
            <td><span className="index-chip">#{s.indexNumber}</span></td>
            <td className="mono-cell">{formatDate(s.dateOfBirth)}</td>
            <td>
              {s.isOnBudget
                ? <span className="badge badge-on">Budget</span>
                : <span className="badge badge-off">Self-funded</span>}
            </td>
            <td>
              <div className="row-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => onOpenProjects(s)}>
                  <FolderKanban size={13} /> Projects
                </button>
                <button className="btn btn-ghost btn-sm btn-icon-only" onClick={() => onEdit(s)} aria-label="Edit">
                  <Pencil size={14} />
                </button>
                <button className="btn btn-ghost btn-sm btn-icon-only" onClick={() => onDelete(s)} aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
