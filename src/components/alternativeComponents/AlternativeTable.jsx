import { useState } from "react";
import EditAlternativeModal from "./EditAlternativeModal";
import AddAlternativeRatingModal from "./alternativeRatingComponents/AddAlternativeRatingModal";
import ViewAlternativeRatingModal from "./alternativeRatingComponents/ViewAlternativeRatingModal";
import ConfirmationModal from "../common/ConfirmationModal";
import { deleteAlternative } from "../../services/alternativeService";

export default function AlternativeTable({ alternatives, onEditAlternative, onDeleteAlternative }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [alternativeToDelete, setAlternativeToDelete] = useState(null);
  const [isAddRatingModalOpen, setIsAddRatingModalOpen] = useState(false);
  const [alternativeForRating, setAlternativeForRating] = useState(null);
  const [isViewRatingModalOpen, setIsViewRatingModalOpen] = useState(false);
  const [alternativeForViewing, setAlternativeForViewing] = useState(null);

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

  const handleDeleteClick = (alternative) => {
    setAlternativeToDelete(alternative);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (alternativeToDelete) {
      try {
        setDeletingId(alternativeToDelete.id);
        await deleteAlternative(alternativeToDelete.id);
        onDeleteAlternative(alternativeToDelete.id);
        setIsDeleteModalOpen(false);
        setAlternativeToDelete(null);
      } catch (error) {
        console.error("Error deleting alternative:", error);
        // You might want to show an error message to the user
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setAlternativeToDelete(null);
  };

  const handleAddRatingClick = (alternative) => {
    setAlternativeForRating(alternative);
    setIsAddRatingModalOpen(true);
  };

  const handleAddRatingClose = () => {
    setIsAddRatingModalOpen(false);
    setAlternativeForRating(null);
  };

  const handleViewRatingClick = (alternative) => {
    setAlternativeForViewing(alternative);
    setIsViewRatingModalOpen(true);
  };

  const handleViewRatingClose = () => {
    setIsViewRatingModalOpen(false);
    setAlternativeForViewing(null);
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
                        <button
                          className="btn btn-sm btn-outline btn-success"
                          onClick={() => handleAddRatingClick(alternative)}
                        >
                          Add Rating
                        </button>
                        <button
                          className="btn btn-sm btn-outline btn-info"
                          onClick={() => handleViewRatingClick(alternative)}
                        >
                          View Rating
                        </button>
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

      {/* Add Rating Modal */}
      {alternativeForRating && (
        <AddAlternativeRatingModal
          isOpen={isAddRatingModalOpen}
          onClose={handleAddRatingClose}
          alternative={alternativeForRating}
        />
      )}

      {/* View Rating Modal */}
      {alternativeForViewing && (
        <ViewAlternativeRatingModal
          isOpen={isViewRatingModalOpen}
          onClose={handleViewRatingClose}
          alternative={alternativeForViewing}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Alternative"
        message={`Are you sure you want to delete "${
          alternativeToDelete?.nama || alternativeToDelete?.name
        }"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deletingId === alternativeToDelete?.id}
      />
    </>
  );
}
