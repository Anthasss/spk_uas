import { useState, useEffect } from "react";
import AddCriteriaModal from "../components/criteriaComponents/AddCriteriaModal";
import CriteriaTable from "../components/criteriaComponents/CriteriaTable";
import { getAllCriteria } from "../services/criteriaService";

export default function CriteriaPage() {
  const [criterias, setCriterias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch criteria from API when component mounts
  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        setLoading(true);
        const data = await getAllCriteria();
        setCriterias(data);
      } catch (err) {
        setError("Failed to fetch criteria");
        console.error("Error fetching criteria:", err);
      } finally {
        setLoading(false);
      }
    }; 

    fetchCriteria();
  }, []);

  const handleAddCriteria = (newCriteria) => {
    setCriterias([...criterias, newCriteria]);
  };

  const handleEditCriteria = (id, updatedCriteria) => {
    setCriterias(criterias.map((criteria) => (criteria.id === id ? { ...criteria, ...updatedCriteria } : criteria)));
  };

  const handleDeleteCriteria = (id) => {
    setCriterias(criterias.filter((criteria) => criteria.id !== id));
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
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Kriteria</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Tambah Kriteria
        </button>
      </div>

      <CriteriaTable
        criterias={criterias}
        onEditCriteria={handleEditCriteria}
        onDeleteCriteria={handleDeleteCriteria}
      />

      {/* Add Criteria Modal */}
      <AddCriteriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCriteria}
      />
    </div>
  );
}
