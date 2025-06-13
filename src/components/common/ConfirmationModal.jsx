export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}) {
  return (
    <>
      {/* Modal */}
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">{title}</h3>
          <p className="text-gray-300 mb-6">{message}</p>

          {/* Modal Actions */}
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              className="btn btn-error"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? <span className="loading loading-spinner loading-sm"></span> : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
