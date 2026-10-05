import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { StudentsApi } from "../api/client";
import { useToast } from "../context/ToastContext";
import StudentTable from "../components/StudentTable";
import StudentFormModal from "../components/StudentFormModal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [dob1, setDob1] = useState("");
  const [dob2, setDob2] = useState("");

  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  async function runSearch(fn, requiredMessage) {
    setLoading(true);
    setHasSearched(true);
    try {
      const result = await fn();
      const list = Array.isArray(result) ? result : result ? [result] : [];
      setResults(list);
    } catch (err) {
      setResults([]);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function searchById() {
    if (!id.trim()) return showToast("Enter a student ID.", "error");
    runSearch(() => StudentsApi.findById(id.trim()));
  }
  function searchByEmail() {
    if (!email.trim()) return showToast("Enter an email address.", "error");
    runSearch(() => StudentsApi.findByEmail(email.trim()));
  }
  function searchByIndex() {
    if (!indexNumber.trim()) return showToast("Enter an index number.", "error");
    runSearch(() => StudentsApi.findByIndex(indexNumber.trim()));
  }
  function searchByDob() {
    if (!dob1 || !dob2) return showToast("Pick both dates.", "error");
    runSearch(() => StudentsApi.findByDobRange(dob1, dob2));
  }

  async function handleUpdate(payload) {
    await StudentsApi.update(editingStudent.id, payload);
    showToast("Student updated.");
    setEditingStudent(null);
    setResults((list) => list.map((s) => (s.id === editingStudent.id ? { ...s, ...payload } : s)));
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await StudentsApi.remove(deleteTarget.id);
      showToast("Student deleted.");
      setResults((list) => list.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Search</h1>
          <div className="topbar-sub">Look up a student by ID, email, index number, or date of birth range.</div>
        </div>
      </div>

      <div className="panel">
        <div className="search-grid">
          <div className="search-block">
            <h3>By student ID</h3>
            <div className="search-row">
              <input className="input" type="number" value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. 3" />
              <button className="btn btn-secondary" onClick={searchById}><SearchIcon size={14} /> Find</button>
            </div>
          </div>
          <div className="search-block">
            <h3>By email</h3>
            <div className="search-row">
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
              <button className="btn btn-secondary" onClick={searchByEmail}><SearchIcon size={14} /> Find</button>
            </div>
          </div>
          <div className="search-block">
            <h3>By index number</h3>
            <div className="search-row">
              <input className="input" type="number" value={indexNumber} onChange={(e) => setIndexNumber(e.target.value)} placeholder="e.g. 10234" />
              <button className="btn btn-secondary" onClick={searchByIndex}><SearchIcon size={14} /> Find</button>
            </div>
          </div>
          <div className="search-block">
            <h3>By date of birth range</h3>
            <div className="search-row">
              <input className="input" type="date" value={dob1} onChange={(e) => setDob1(e.target.value)} />
              <span className="range-sep">&ndash;</span>
              <input className="input" type="date" value={dob2} onChange={(e) => setDob2(e.target.value)} />
              <button className="btn btn-secondary" onClick={searchByDob}><SearchIcon size={14} /> Find</button>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <StudentTable
          students={results}
          loading={loading}
          emptyMessage={hasSearched ? "No matching students found." : "Run a search above to see results here."}
          onEdit={(s) => setEditingStudent(s)}
          onDelete={(s) => setDeleteTarget(s)}
          onOpenProjects={(s) => navigate(`/students/${s.id}/projects`, { state: { student: s } })}
        />
      </div>

      {editingStudent && (
        <StudentFormModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSubmit={handleUpdate}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete student?"
          message={`This will permanently remove ${deleteTarget.firstName} ${deleteTarget.lastName} and cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          busy={deleting}
        />
      )}
    </>
  );
}
