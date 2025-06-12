import { useState } from "react";
import AddCriteriaModal from "../components/criteriaComponents/AddCriteriaModal";
import CriteriaTable from "../components/criteriaComponents/CriteriaTable";

export default function CriteriaPage() {
  // Sample data for demonstration
  const [criterias, setCriterias] = useState([
    { id: 1, nama: "Harga", bobot: 0.25 },
    { id: 2, nama: "RAM", bobot: 0.2 },
    { id: 3, nama: "Storage", bobot: 0.15 },
    { id: 4, nama: "Kamera", bobot: 0.2 },
    { id: 5, nama: "Baterai", bobot: 0.2 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCriteria = (newCriteria) => {
    const newId = Math.max(...criterias.map((c) => c.id)) + 1;
    setCriterias([...criterias, { id: newId, ...newCriteria }]);
  };

  const handleEditCriteria = (id, updatedCriteria) => {
    setCriterias(criterias.map((criteria) => (criteria.id === id ? { ...criteria, ...updatedCriteria } : criteria)));
  };

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
