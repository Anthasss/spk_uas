import { useState, useEffect } from "react";
import AddAlternativeModal from "../components/alternativeComponents/AddAlternativeModal";
import AlternativeTable from "../components/alternativeComponents/AlternativeTable";
import { getAllAlternatives } from "../services/alternativeService";

export default function AlternativePage() {
  const [alternatives, setAlternatives] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch alternatives from API when component mounts
  useEffect(() => {
    const fetchAlternatives = async () => {
      try {
        setLoading(true);
        const data = await getAllAlternatives();
        setAlternatives(data);
        console.log("alternatives:", data);
      } catch (err) {
        setError("Failed to fetch alternatives");
        console.error("Error fetching alternatives:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlternatives();
  }, []);

  const handleAddAlternative = (newAlternative) => {
    setAlternatives([...alternatives, newAlternative]);
  };

  const handleEditAlternative = (id, updatedAlternative) => {
    setAlternatives(
      alternatives.map((alternative) =>
        alternative.id === id ? { ...alternative, ...updatedAlternative } : alternative
      )
    );
  };

  const handleDeleteAlternative = (id) => {
    setAlternatives(alternatives.filter((alternative) => alternative.id !== id));
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
        onDeleteAlternative={handleDeleteAlternative}
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
