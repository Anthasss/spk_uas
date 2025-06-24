import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllCriteria } from "../services/criteriaService";
import SubCriteriaTable from "../components/subCriteriaComponents/SubCriteriaTable";
import AddSubCriteriaModal from "../components/subCriteriaComponents/AddSubCriteriaModal";

export default function SubCriteria() {
  const { id } = useParams();
  const [allCriteria, setAllCriteria] = useState([]);
  const [selectedCriteriaId, setSelectedCriteriaId] = useState(id || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all criteria for dropdown
  useEffect(() => {
    const fetchAllCriteria = async () => {
      try {
        const criteriaData = await getAllCriteria();
        setAllCriteria(criteriaData);
        console.log("All criteria:", criteriaData);

        // Automatically select the first criteria if none is selected
        if (!selectedCriteriaId && criteriaData.length > 0) {
          setSelectedCriteriaId(criteriaData[0].id);
        }
      } catch (err) {
        console.error("Error fetching all criteria:", err);
        setError("Failed to fetch criteria.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCriteria();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get sub-criteria for the selected criteria
  const selectedCriteria = allCriteria.find((criteria) => criteria.id === parseInt(selectedCriteriaId));

  const handleCriteriaChange = (e) => {
    const newCriteriaId = e.target.value;
    setSelectedCriteriaId(newCriteriaId);
    setError(null); // Clear any previous errors
  };

  const handleAddSubCriteria = (newSubCriteria) => {
    if (selectedCriteria) {
      selectedCriteria.subCriteria = [...selectedCriteria.subCriteria, newSubCriteria];
    }
  };

  const handleEditSubCriteria = (subCriteriaId, updatedData) => {
    if (selectedCriteria) {
      selectedCriteria.subCriteria = selectedCriteria.subCriteria.map((item) =>
        item.id === subCriteriaId ? { ...item, ...updatedData } : item
      );
    }
  };

  const handleDeleteSubCriteria = (subCriteriaId) => {
    if (selectedCriteria) {
      // Update the subCriteria array for the selected criteria
      const updatedSubCriteria = selectedCriteria.subCriteria.filter((item) => item.id !== subCriteriaId);

      // Update the selectedCriteria object
      const updatedCriteria = { ...selectedCriteria, subCriteria: updatedSubCriteria };

      // Update the allCriteria state with the modified criteria
      setAllCriteria((prevCriteria) =>
        prevCriteria.map((criteria) => (criteria.id === selectedCriteria.id ? updatedCriteria : criteria))
      );
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>Error loading data: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Sub Criteria Management</h1>
      </div>

      {/* Criteria Selection Dropdown */}
      <div className="flex justify-between items-center">
        <div>
          <label className="block text-sm font-medium mb-2">Select Criteria:</label>
          <select
            className="select select-bordered w-full max-w-xs"
            value={selectedCriteriaId}
            onChange={handleCriteriaChange}
          >
            {allCriteria.map((criteriaItem) => (
              <option
                key={criteriaItem.id}
                value={criteriaItem.id}
              >
                {criteriaItem.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCriteriaId && (
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
          >
            Add Sub Criteria
          </button>
        )}
      </div>

      {selectedCriteriaId && selectedCriteria && (
        <>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <SubCriteriaTable
              subCriterias={selectedCriteria.subCriteria}
              onEditSubCriteria={handleEditSubCriteria}
              onDeleteSubCriteria={handleDeleteSubCriteria}
            />
          )}

          <AddSubCriteriaModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddSubCriteria}
            criteriaId={selectedCriteriaId}
          />
        </>
      )}

      {!selectedCriteriaId && (
        <div className="text-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  );
}
