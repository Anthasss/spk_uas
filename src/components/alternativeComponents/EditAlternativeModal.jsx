import { useState, useEffect } from "react";

export default function EditAlternativeModal({ isOpen, onClose, onSave, alternative }) {
  const [alternativeName, setAlternativeName] = useState("");

  // Set initial values when alternative prop changes
  useEffect(() => {
    if (alternative) {
      setAlternativeName(alternative.nama);
    }
  }, [alternative]);

  const handleSave = () => {
    if (alternativeName.trim()) {
      onSave({
        nama: alternativeName.trim(),
      });
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setAlternativeName(alternative?.nama || "");
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
            />
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
              disabled={!alternativeName.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
