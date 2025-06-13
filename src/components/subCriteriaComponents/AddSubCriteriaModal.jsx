import { useState } from "react";
import { createSubCriteria } from "../../services/subCriteriaService";

export default function AddSubCriteriaModal({ isOpen, onClose, onSave, criteriaId }) {
  const [realValue, setRealValue] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (realValue.trim() && ratingValue > 0) {
      try {
        setLoading(true);
        const newSubCriteria = await createSubCriteria({
          realValue: realValue.trim(),
          ratingValue: parseInt(ratingValue),
          criteriaId: criteriaId,
        });
        onSave(newSubCriteria);
        // Reset form
        setRealValue("");
        setRatingValue(0);
        onClose();
      } catch (error) {
        console.error("Error creating sub-criteria:", error);
        // You might want to show an error message to the user
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setRealValue("");
    setRatingValue(0);
    onClose();
  };

  return (
    <>
      {/* Modal */}
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add a new sub criteria</h3>

          {/* Real Value Input */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Real Value</span>
            </label>
            <input
              type="text"
              placeholder="Enter real value"
              className="input input-bordered w-full"
              value={realValue}
              onChange={(e) => setRealValue(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Rating Value Input */}
          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text">Rating Value</span>
            </label>
            <input
              type="number"
              placeholder="0"
              min="1"
              max="5"
              className="input input-bordered w-full"
              value={ratingValue}
              onChange={(e) => setRatingValue(e.target.value)}
              disabled={loading}
            />
            <label className="label">
              <span className="label-text-alt">Value between 1 - 5</span>
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
              disabled={!realValue.trim() || ratingValue <= 0 || loading}
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
