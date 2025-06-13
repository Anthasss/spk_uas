import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditCriteriaModal from "./EditCriteriaModal";
import ConfirmationModal from "../common/ConfirmationModal";
import { deleteCriteria } from "../../services/criteriaService";

export default function CriteriaTable({ criterias, onEditCriteria, onDeleteCriteria }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [criteriaToDelete, setCriteriaToDelete] = useState(null);
  const navigate = useNavigate();

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

  const handleDeleteClick = (criteria) => {
    setCriteriaToDelete(criteria);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (criteriaToDelete) {
      try {
        setDeletingId(criteriaToDelete.id);
        await deleteCriteria(criteriaToDelete.id);
        onDeleteCriteria(criteriaToDelete.id);
        setIsDeleteModalOpen(false);
        setCriteriaToDelete(null);
      } catch (error) {
        console.error("Error deleting criteria:", error);
        // You might want to show an error message to the user
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setCriteriaToDelete(null);
  };

  const handleRatingsClick = (criteria) => {
    // Navigate to sub-criteria page, optionally passing criteria ID as parameter
    navigate(`/sub-criteria/${criteria.id}`);
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
                  <th>Type</th>
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
                      <span className={`badge ${criteria.type === 'BENEFIT' ? 'badge-success' : 'badge-warning'}`}>
                        {criteria.type || 'BENEFIT'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm btn-outline btn-warning"
                          onClick={() => handleRatingsClick(criteria)}
                        >
                          Ratings
                        </button>
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Criteria"
        message={`Are you sure you want to delete "${criteriaToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deletingId === criteriaToDelete?.id}
      />
    </>
  );
}
