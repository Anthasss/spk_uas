import { useState, useEffect } from "react";
import { updateCriteria } from "../../services/criteriaService";

export default function EditCriteriaModal({ isOpen, onClose, onSave, criteria, totalWeight }) {
  const [criteriaName, setCriteriaName] = useState("");
  const [criteriaWeight, setCriteriaWeight] = useState(0);
  const [criteriaType, setCriteriaType] = useState("BENEFIT");
  const [loading, setLoading] = useState(false);

  // Set initial values when criteria prop changes
  useEffect(() => {
    if (criteria) {
      setCriteriaName(criteria.name || criteria.nama);
      setCriteriaWeight(criteria.weight || criteria.bobot);
      setCriteriaType(criteria.type || "BENEFIT");
    }
  }, [criteria]);

  // Calculate if total weight exceeds 1 directly (excluding current criteria being edited)
  const totalWeightExcludingCurrent = criteria ? totalWeight - (criteria.weight || criteria.bobot) : totalWeight;

  const exceedsTotalWeight = totalWeightExcludingCurrent + criteriaWeight > 1;

  const handleWeightChange = (value) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      setCriteriaWeight(parsedValue);
      console.log("new total weight =", criteriaWeight + totalWeightExcludingCurrent);
      console.log("exceeds total weight =", exceedsTotalWeight);
    } else {
      setCriteriaWeight(0); // Reset to 0 if input is invalid
    }
  };

  const handleSave = async () => {
    if (criteriaName.trim() && criteriaWeight > 0 && criteriaWeight <= 1 && !exceedsTotalWeight) {
      try {
        setLoading(true);
        const updatedCriteria = await updateCriteria(criteria.id, {
          name: criteriaName.trim(),
          weight: parseFloat(criteriaWeight),
          type: criteriaType,
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
    setCriteriaType(criteria?.type || "BENEFIT");
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
              onChange={(e) => handleWeightChange(e.target.value)}
              disabled={loading}
            />
            <label className="label">
              <span className="label-text-alt">Value between 0.0 - 1.0</span>
            </label>
          </div>

          {/* Warning if total weight exceeds 1 */}
          {exceedsTotalWeight && (
            <div className="text-red-500 text-sm mb-4">Total bobot tidak boleh melebihi 1. Kurangi bobot kriteria.</div>
          )}

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
              disabled={
                !criteriaName.trim() || criteriaWeight <= 0 || criteriaWeight > 1 || exceedsTotalWeight || loading
              }
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
