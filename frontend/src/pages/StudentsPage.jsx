import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { StudentsApi, ProjectsApi } from "../api/client";
import { useToast } from "../context/ToastContext";
import StudentTable from "../components/StudentTable";
import StudentFormModal from "../components/StudentFormModal";
import ConfirmDialog from "../components/ConfirmDialog";
import DonutChart from "../components/DonutChart";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [projectCount, setProjectCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, projects] = await Promise.all([
        StudentsApi.list(),
        ProjectsApi.listAll().catch(() => []),
      ]);
      setStudents(list || []);
      setProjectCount((projects || []).length);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const onBudgetCount = students.filter((s) => s.isOnBudget).length;
  const selfFundedCount = students.length - onBudgetCount;

  async function handleCreateOrUpdate(payload) {
    if (editingStudent) {
      await StudentsApi.update(editingStudent.id, payload);
      showToast("Student updated.");
    } else {
      await StudentsApi.create(payload);
      showToast("Student added.");
    }
    setShowForm(false);
    setEditingStudent(null);
    load();
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await StudentsApi.remove(deleteTarget.id);
      showToast("Student deleted.");
      setDeleteTarget(null);
      load();
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
          <h1>Students</h1>
          <div className="topbar-sub">Every enrolled student on record.</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingStudent(null); setShowForm(true); }}>
          <Plus size={15} /> New student
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total students</div>
          <div className="stat-value">{students.length}</div>
          <div className="stat-foot">on the current ledger</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Budget-financed</div>
          <div className="stat-value">{onBudgetCount}</div>
          <div className="stat-foot">{selfFundedCount} self-funded</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Logged projects</div>
          <div className="stat-value">{projectCount ?? "\u2014"}</div>
          <div className="stat-foot">across all students</div>
        </div>
        <div className="stat-card donut-card">
          <DonutChart onBudget={onBudgetCount} selfFunded={selfFundedCount} />
          <div className="donut-legend">
            <div className="donut-legend-row">
              <span className="donut-dot" style={{ background: "#4F46E5" }} /> Budget
            </div>
            <div className="donut-legend-row">
              <span className="donut-dot" style={{ background: "#EFEFF3" }} /> Self-funded
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <StudentTable
          students={students}
          loading={loading}
          emptyMessage="No students on record yet. Add the first one."
          onEdit={(s) => { setEditingStudent(s); setShowForm(true); }}
          onDelete={(s) => setDeleteTarget(s)}
          onOpenProjects={(s) => navigate(`/students/${s.id}/projects`, { state: { student: s } })}
        />
      </div>

      {showForm && (
        <StudentFormModal
          student={editingStudent}
          onClose={() => { setShowForm(false); setEditingStudent(null); }}
          onSubmit={handleCreateOrUpdate}
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
