import { useState } from "react";

export default function AddCriteriaModal({ isOpen, onClose, onSave }) {
  const [criteriaName, setCriteriaName] = useState("");
  const [criteriaWeight, setCriteriaWeight] = useState(0);

  const handleSave = () => {
    if (criteriaName.trim() && criteriaWeight > 0) {
      onSave({
        nama: criteriaName.trim(),
        bobot: parseFloat(criteriaWeight),
      });
      // Reset form
      setCriteriaName("");
      setCriteriaWeight(0);
      onClose();
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setCriteriaName("");
    setCriteriaWeight(0);
    onClose();
  };

  return (
    <>
      {/* Modal */}
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add a new criteria</h3>

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
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!criteriaName.trim() || criteriaWeight <= 0}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
