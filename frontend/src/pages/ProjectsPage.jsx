import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, FolderOpen, Trash2 } from "lucide-react";
import { StudentsApi, ProjectsApi } from "../api/client";
import { useToast } from "../context/ToastContext";
import ProjectFormModal from "../components/ProjectFormModal";
import ConfirmDialog from "../components/ConfirmDialog";

function initials(first, last) {
  return `${(first || "?").charAt(0)}${(last || "").charAt(0)}`.toUpperCase();
}

export default function ProjectsPage() {
  const { studentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [student, setStudent] = useState(location.state?.student || null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (!student) {
        const s = await StudentsApi.findById(studentId);
        setStudent(s);
      }
      const list = await StudentsApi.listProjects(studentId);
      setProjects(list || []);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(payload) {
    await StudentsApi.createProject(studentId, payload);
    showToast("Project added.");
    setShowForm(false);
    load();
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await ProjectsApi.remove(deleteTarget.id);
      showToast("Project deleted.");
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
      <button className="back-link" onClick={() => navigate("/students")}>
        <ArrowLeft size={15} /> Back to students
      </button>

      <div className="panel">
        <div className="student-header-card">
          <span className="avatar-seal">{student ? initials(student.firstName, student.lastName) : "?"}</span>
          <div>
            <h2>{student ? `${student.firstName} ${student.lastName}` : "Loading..."}</h2>
            <div className="student-meta">
              {student ? `${student.email} \u00b7 index #${student.indexNumber}` : ""}
            </div>
          </div>
        </div>
      </div>

      <div className="panel-title-row">
        <h2>Projects</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={15} /> New project
        </button>
      </div>

      <div className="panel">
        {loading ? (
          <div className="panel-body">
            <div className="skeleton-bar" style={{ width: "100%", height: 80 }} />
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <FolderOpen size={28} className="empty-state-icon" />
            <div>No projects logged for this student yet.</div>
          </div>
        ) : (
          <div className="project-grid">
            {projects.map((p) => (
              <div className="project-card" key={p.id}>
                <div className="project-id">Project #{p.id}</div>
                <h4>{p.projectName}</h4>
                <p>{p.projectDescription}</p>
                <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(p)}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ProjectFormModal onClose={() => setShowForm(false)} onSubmit={handleCreate} />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete project?"
          message="This project will be permanently removed."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          busy={deleting}
        />
      )}
    </>
  );
}
