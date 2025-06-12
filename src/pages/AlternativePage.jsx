import { useState } from "react";
import AddAlternativeModal from "../components/alternativeComponents/AddAlternativeModal";
import AlternativeTable from "../components/alternativeComponents/AlternativeTable";

export default function AlternativePage() {
  // Sample data for demonstration
  const [alternatives, setAlternatives] = useState([
    { id: 1, nama: "Samsung Galaxy S24" },
    { id: 2, nama: "iPhone 15 Pro" },
    { id: 3, nama: "Xiaomi 14" }, 
    { id: 4, nama: "OnePlus 12" },
    { id: 5, nama: "Google Pixel 8" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddAlternative = (newAlternative) => {
    const newId = Math.max(...alternatives.map((a) => a.id)) + 1;
    setAlternatives([...alternatives, { id: newId, ...newAlternative }]);
  };

  const handleEditAlternative = (id, updatedAlternative) => {
    setAlternatives(
      alternatives.map((alternative) =>
        alternative.id === id ? { ...alternative, ...updatedAlternative } : alternative
      )
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Alternatif</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add Alternatif
        </button>
      </div>

      <AlternativeTable
        alternatives={alternatives}
        onEditAlternative={handleEditAlternative}
      />

      {/* Add Alternative Modal */}
      <AddAlternativeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddAlternative}
      />
    </div>
  );
}
