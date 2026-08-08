import { useState } from "react";
import Modal from "./Modal";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  dateOfBirth: "",
  indexNumber: "",
  isOnBudget: false,
};

export default function StudentFormModal({ student, onClose, onSubmit }) {
  const isEdit = !!student;
  const [form, setForm] = useState(
    isEdit
      ? {
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          dateOfBirth: student.dateOfBirth,
          indexNumber: student.indexNumber,
          isOnBudget: !!student.isOnBudget,
        }
      : emptyForm
  );
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        dateOfBirth: form.dateOfBirth,
        indexNumber: Number(form.indexNumber),
        isOnBudget: form.isOnBudget,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title={isEdit ? "Edit student" : "New student"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field">
            <span className="field-label">First name</span>
            <input
              className="input"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              required
              maxLength={50}
            />
          </label>
          <label className="field">
            <span className="field-label">Last name</span>
            <input
              className="input"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              required
              maxLength={50}
            />
          </label>
          <label className="field field-span-2">
            <span className="field-label">Email</span>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
              maxLength={254}
            />
          </label>
          <label className="field">
            <span className="field-label">Date of birth</span>
            <input
              className="input"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span className="field-label">Index number</span>
            <input
              className="input"
              type="number"
              min="1"
              max="99999999"
              value={form.indexNumber}
              onChange={(e) => update("indexNumber", e.target.value)}
              required
            />
          </label>
          <label className="field-checkbox field-span-2">
            <input
              type="checkbox"
              checked={form.isOnBudget}
              onChange={(e) => update("isOnBudget", e.target.checked)}
            />
            <span className="field-label">Budget-financed</span>
          </label>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Add student"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
