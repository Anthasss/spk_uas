import { useState, useMemo } from "react";
import ConfirmationModal from "../common/ConfirmationModal";
import { deleteSubCriteria } from "../../services/subCriteriaService";

export default function SubCriteriaTable({ subCriterias, onDeleteSubCriteria }) {
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subCriteriaToDelete, setSubCriteriaToDelete] = useState(null);

  // Sort subCriterias by ratingValue from largest to lowest
  const sortedSubCriterias = useMemo(() => {
    return [...subCriterias].sort((a, b) => b.ratingValue - a.ratingValue);
  }, [subCriterias]);

  const handleEditClick = (subCriteria) => {
    // TODO: Implement edit functionality
    console.log("Edit sub-criteria:", subCriteria);
  };

  const handleDeleteClick = (subCriteria) => {
    setSubCriteriaToDelete(subCriteria);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (subCriteriaToDelete) {
      try {
        setDeletingId(subCriteriaToDelete.id);
        await deleteSubCriteria(subCriteriaToDelete.id);
        onDeleteSubCriteria(subCriteriaToDelete.id);
        setIsDeleteModalOpen(false);
        setSubCriteriaToDelete(null);
      } catch (error) {
        console.error("Error deleting sub-criteria:", error);
        // You might want to show an error message to the user
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSubCriteriaToDelete(null);
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
                  <th>Real Value</th>
                  <th>Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedSubCriterias.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center text-gray-500"
                    >
                      No sub-criteria found
                    </td>
                  </tr>
                ) : (
                  sortedSubCriterias.map((subCriteria, index) => (
                    <tr key={subCriteria.id}>
                      <td>{index + 1}</td>
                      <td>{subCriteria.realValue}</td>
                      <td>{subCriteria.ratingValue}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-outline btn-primary"
                            onClick={() => handleEditClick(subCriteria)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline btn-error"
                            onClick={() => handleDeleteClick(subCriteria)}
                            disabled={deletingId === subCriteria.id}
                          >
                            {deletingId === subCriteria.id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Delete"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Sub Criteria"
        message={`Are you sure you want to delete this sub-criteria? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deletingId === subCriteriaToDelete?.id}
      />
    </>
  );
}
