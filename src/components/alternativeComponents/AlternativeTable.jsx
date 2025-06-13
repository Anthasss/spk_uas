import { useState } from "react";
import EditAlternativeModal from "./EditAlternativeModal";
import { deleteAlternative } from "../../services/alternativeService";

export default function AlternativeTable({ alternatives, onEditAlternative, onDeleteAlternative }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleEditClick = (alternative) => {
    setSelectedAlternative(alternative);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (updatedAlternative) => {
    onEditAlternative(selectedAlternative.id, updatedAlternative);
    setIsEditModalOpen(false);
    setSelectedAlternative(null);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setSelectedAlternative(null);
  };

  const handleDeleteClick = async (alternative) => {
    if (window.confirm(`Are you sure you want to delete "${alternative.name}"?`)) {
      try {
        setDeletingId(alternative.id);
        await deleteAlternative(alternative.id);
        onDeleteAlternative(alternative.id);
      } catch (error) {
        console.error("Error deleting alternative:", error);
        // You might want to show an error message to the user
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Alternative Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {alternatives.map((alternative, index) => (
                  <tr key={alternative.id}>
                    <td>{index + 1}</td>
                    <td>{alternative.nama || alternative.name}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-outline btn-success">Add Rating</button>
                        <button className="btn btn-sm btn-outline btn-info">View Rating</button>
                        <button
                          className="btn btn-sm btn-outline btn-primary"
                          onClick={() => handleEditClick(alternative)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline btn-error"
                          onClick={() => handleDeleteClick(alternative)}
                          disabled={deletingId === alternative.id}
                        >
                          {deletingId === alternative.id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Alternative Modal */}
      {selectedAlternative && (
        <EditAlternativeModal
          isOpen={isEditModalOpen}
          onClose={handleEditClose}
          onSave={handleEditSave}
          alternative={selectedAlternative}
        />
      )}
    </>
  );
}
