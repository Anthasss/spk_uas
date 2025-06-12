import { useState } from "react";
import EditAlternativeModal from "./EditAlternativeModal";

export default function AlternativeTable({ alternatives, onEditAlternative }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState(null);

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
                    <td>{alternative.nama}</td>
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
                        <button className="btn btn-sm btn-outline btn-error">Delete</button>
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
