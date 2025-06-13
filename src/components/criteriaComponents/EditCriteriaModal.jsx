import { useState, useEffect } from "react";
import { updateCriteria } from "../../services/criteriaService";

export default function EditCriteriaModal({ isOpen, onClose, onSave, criteria }) {
  const [criteriaName, setCriteriaName] = useState("");
  const [criteriaWeight, setCriteriaWeight] = useState(0);
  const [loading, setLoading] = useState(false);

  // Set initial values when criteria prop changes
  useEffect(() => {
    if (criteria) {
      setCriteriaName(criteria.name || criteria.nama);
      setCriteriaWeight(criteria.weight || criteria.bobot);
    }
  }, [criteria]);

  const handleSave = async () => {
    if (criteriaName && criteriaWeight > 0 && criteria) {
      try {
        setLoading(true);
        const updatedCriteria = await updateCriteria(criteria.id, {
          name: criteriaName.trim(),
          weight: parseFloat(criteriaWeight),
        });
        onSave(updatedCriteria);
        onClose();
      } catch (error) {
        console.error("Error updating criteria:", error);
        // You might want to show an error message to the user
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setCriteriaName(criteria?.name || "");
    setCriteriaWeight(criteria?.weight || 0);
    onClose();
  };

  return (
    <>
      {/* Modal */}
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Criteria</h3>

          {/* Criteria Name Input */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan nama kriteria"
              className="input input-bordered w-full"
              value={criteriaName}
              onChange={(e) => setCriteriaName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Criteria Weight Input */}
          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text">Weight</span>
            </label>
            <input
              type="number"
              placeholder="0.0"
              step="0.01"
              min="0"
              max="1"
              className="input input-bordered w-full"
              value={criteriaWeight}
              onChange={(e) => setCriteriaWeight(e.target.value)}
              disabled={loading}
            />
            <label className="label">
              <span className="label-text-alt">Value between 0.0 - 1.0</span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!criteriaName.trim() || criteriaWeight <= 0 || loading}
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
