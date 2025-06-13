import { useState, useEffect } from "react";
import { updateAlternative } from "../../services/alternativeService";

export default function EditAlternativeModal({ isOpen, onClose, onSave, alternative }) {
  const [alternativeName, setAlternativeName] = useState("");
  const [loading, setLoading] = useState(false);

  // Set initial values when alternative prop changes
  useEffect(() => {
    if (alternative) {
      setAlternativeName(alternative.name || alternative.name);
    }
  }, [alternative]);

  const handleSave = async () => {
    if (alternativeName.trim() && alternative) {
      try {
        setLoading(true);
        const updatedAlternative = await updateAlternative(alternative.id, {
          name: alternativeName.trim(),
        });
        onSave(updatedAlternative);
        onClose();
      } catch (error) {
        console.error("Error updating alternative:", error);
        // You might want to show an error message to the user
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setAlternativeName(alternative?.name || "");
    onClose();
  };

  return (
    <>
      {/* Modal */}
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Alternative</h3>

          {/* Alternative Name Input */}
          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan nama alternatif"
              className="input input-bordered w-full"
              value={alternativeName}
              onChange={(e) => setAlternativeName(e.target.value)}
              disabled={loading}
            />
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
              disabled={!alternativeName.trim() || loading}
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
