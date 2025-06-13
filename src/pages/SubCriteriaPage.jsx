import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCriteriaById } from "../services/criteriaService";
import { getSubCriteriaByCriteriaId } from "../services/subCriteriaService";
import SubCriteriaTable from "../components/subCriteriaComponents/SubCriteriaTable";
import AddSubCriteriaModal from "../components/subCriteriaComponents/AddSubCriteriaModal";

export default function SubCriteria() {
  const { id } = useParams();
  const [criteria, setCriteria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subCriterias, setSubCriterias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch criteria and sub-criteria data in parallel
        const [criteriaData, subCriteriaData] = await Promise.all([
          getCriteriaById(id),
          getSubCriteriaByCriteriaId(id),
        ]);

        setCriteria(criteriaData);
        setSubCriterias(subCriteriaData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleAddSubCriteria = (newSubCriteria) => {
    setSubCriterias((prev) => [...prev, newSubCriteria]);
  };

  const handleEditSubCriteria = (subCriteriaId, updatedData) => {
    setSubCriterias((prev) =>
      prev.map((item) =>
        item.id === subCriteriaId ? { ...item, ...updatedData } : item
      )
    );
  };

  const handleDeleteSubCriteria = (subCriteriaId) => {
    setSubCriterias((prev) => prev.filter((item) => item.id !== subCriteriaId));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold">
          Sub Criteria of {criteria?.name || "Loading..."}
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add Sub Criteria
        </button>
      </div>

      <SubCriteriaTable
        subCriterias={subCriterias}
        onEditSubCriteria={handleEditSubCriteria}
        onDeleteSubCriteria={handleDeleteSubCriteria}
      />

      {/* Add Sub Criteria Modal */}
      <AddSubCriteriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSubCriteria}
        criteriaId={id}
      />
    </div>
  );
}
