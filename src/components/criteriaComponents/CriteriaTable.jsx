import { useState } from "react";
import EditCriteriaModal from "./EditCriteriaModal";
import { deleteCriteria } from "../../services/criteriaService";

export default function CriteriaTable({ criterias, onEditCriteria, onDeleteCriteria }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleEditClick = (criteria) => {
    setSelectedCriteria(criteria);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (updatedCriteria) => {
    onEditCriteria(selectedCriteria.id, updatedCriteria);
    setIsEditModalOpen(false);
    setSelectedCriteria(null);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setSelectedCriteria(null);
  };

  const handleDeleteClick = async (criteria) => {
    if (window.confirm(`Are you sure you want to delete "${criteria.name}"?`)) {
      try {
        setDeletingId(criteria.id);
        await deleteCriteria(criteria.id);
        onDeleteCriteria(criteria.id);
      } catch (error) {
        console.error("Error deleting criteria:", error);
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
                  <th>Criteria Name</th>
                  <th>Weight</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {criterias.map((criteria, index) => (
                  <tr key={criteria.id}>
                    <td>{index + 1}</td>
                    <td>{criteria.name}</td>
                    <td>{criteria.weight}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm btn-outline btn-primary"
                          onClick={() => handleEditClick(criteria)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline btn-error"
                          onClick={() => handleDeleteClick(criteria)}
                          disabled={deletingId === criteria.id}
                        >
                          {deletingId === criteria.id ? (
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

      {/* Edit Criteria Modal */}
      {selectedCriteria && (
        <EditCriteriaModal
          isOpen={isEditModalOpen}
          onClose={handleEditClose}
          onSave={handleEditSave}
          criteria={selectedCriteria}
        />
      )}
    </>
  );
}
