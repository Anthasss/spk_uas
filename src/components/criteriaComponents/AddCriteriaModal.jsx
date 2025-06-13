import { useState } from "react";
import { createCriteria } from "../../services/criteriaService";

export default function AddCriteriaModal({ isOpen, onClose, onSave }) {
  const [criteriaName, setCriteriaName] = useState("");
  const [criteriaWeight, setCriteriaWeight] = useState(0);
  const [criteriaType, setCriteriaType] = useState("BENEFIT");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (criteriaName.trim() && criteriaWeight > 0) {
      try {
        setLoading(true);
        const newCriteria = await createCriteria({
          name: criteriaName.trim(),
          weight: parseFloat(criteriaWeight),
          type: criteriaType,
        });
        onSave(newCriteria);
        // Reset form
        setCriteriaName("");
        setCriteriaWeight(0);
        setCriteriaType("BENEFIT");
        onClose();
      } catch (error) {
        console.error("Error creating criteria:", error);
        // You might want to show an error message to the user
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setCriteriaName("");
    setCriteriaWeight(0);
    setCriteriaType("BENEFIT");
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
              disabled={loading}
            />
          </div>

          {/* Criteria Weight Input */}
          <div className="form-control w-full mb-4">
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

          {/* Criteria Type Select */}
          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text">Type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={criteriaType}
              onChange={(e) => setCriteriaType(e.target.value)}
              disabled={loading}
            >
              <option value="BENEFIT">BENEFIT</option>
              <option value="COST">COST</option>
            </select>
            <label className="label">
              <span className="label-text-alt">Choose BENEFIT for positive impact or COST for negative impact</span>
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
