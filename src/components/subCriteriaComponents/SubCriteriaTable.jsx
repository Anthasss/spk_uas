import { useState } from "react";
import { deleteSubCriteria } from "../../services/subCriteriaService";

export default function SubCriteriaTable({ subCriterias, onDeleteSubCriteria }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleEditClick = (subCriteria) => {
    // TODO: Implement edit functionality
    console.log("Edit sub-criteria:", subCriteria);
  };

  const handleDeleteClick = async (subCriteria) => {
    if (window.confirm(`Are you sure you want to delete this sub-criteria?`)) {
      try {
        setDeletingId(subCriteria.id);
        await deleteSubCriteria(subCriteria.id);
        onDeleteSubCriteria(subCriteria.id);
      } catch (error) {
        console.error("Error deleting sub-criteria:", error);
        // You might want to show an error message to the user
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
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
              {subCriterias.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-gray-500"
                  >
                    No sub-criteria found
                  </td>
                </tr>
              ) : (
                subCriterias.map((subCriteria, index) => (
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
  );
}
