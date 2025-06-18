import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  // getCriteriaById,
  getAllCriteria,
} from "../services/criteriaService";
import { getSubCriteriaByCriteriaId } from "../services/subCriteriaService";
import SubCriteriaTable from "../components/subCriteriaComponents/SubCriteriaTable";
import AddSubCriteriaModal from "../components/subCriteriaComponents/AddSubCriteriaModal";

export default function SubCriteria() {
  const { id } = useParams();
  // const [criteria, setCriteria] = useState(null);
  const [allCriteria, setAllCriteria] = useState([]);
  const [selectedCriteriaId, setSelectedCriteriaId] = useState(id || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subCriterias, setSubCriterias] = useState([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all criteria for dropdown
  useEffect(() => {
    const fetchAllCriteria = async () => {
      try {
        const criteriaData = await getAllCriteria();
        setAllCriteria(criteriaData);

        // Automatically select the first criteria if none is selected
        if (!selectedCriteriaId && criteriaData.length > 0) {
          setSelectedCriteriaId(criteriaData[0].id);
        }
      } catch (err) {
        console.error("Error fetching all criteria:", err);
      }
    };

    fetchAllCriteria();
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch data when selectedCriteriaId changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCriteriaId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch criteria and sub-criteria data in parallel
        const [subCriteriaData] = await Promise.all([
          // getCriteriaById(selectedCriteriaId),
          getSubCriteriaByCriteriaId(selectedCriteriaId),
        ]);

        // setCriteria(criteriaData);
        setSubCriterias(subCriteriaData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCriteriaId]);

  const handleCriteriaChange = (e) => {
    const newCriteriaId = e.target.value;
    setSelectedCriteriaId(newCriteriaId);
    setError(null); // Clear any previous errors
  };

  // const handleAddSubCriteria = (newSubCriteria) => {
  //   setSubCriterias((prev) => [...prev, newSubCriteria]);
  // };

  // const handleEditSubCriteria = (subCriteriaId, updatedData) => {
  //   setSubCriterias((prev) => prev.map((item) => (item.id === subCriteriaId ? { ...item, ...updatedData } : item)));
  // };

  // const handleDeleteSubCriteria = (subCriteriaId) => {
  //   setSubCriterias((prev) => prev.filter((item) => item.id !== subCriteriaId));
  // };

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
        {/* dropdown menu */}
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

        {/* Button to add sub-criteria */}
        {/* {selectedCriteriaId && (
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
          >
            Add Sub Criteria
          </button>
        )} */}
      </div>

      {selectedCriteriaId && (
        <>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <SubCriteriaTable
              subCriterias={subCriterias}
              // onEditSubCriteria={handleEditSubCriteria}
              // onDeleteSubCriteria={handleDeleteSubCriteria}
            />
          )}

          {/* Add Sub Criteria Modal */}
          {/* <AddSubCriteriaModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddSubCriteria}
            criteriaId={selectedCriteriaId}
          /> */}
        </>
      )}

      {/* Show message when no criteria is selected */}
      {!selectedCriteriaId && (
        <div className="text-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  );
}
