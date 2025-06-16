import { useState, useEffect } from "react";
import { useUtilityMatrix } from "../../hooks/useUtilityMatrix";

export default function PreferenceTable({ alternatives, criteria, ratings }) {
  const utilityMatrix = useUtilityMatrix(alternatives, criteria, ratings);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset to first page when alternatives change
  useEffect(() => {
    setCurrentPage(1);
  }, [alternatives]);

  // Calculate preference values for each alternative
  const calculatePreferenceValue = (alternativeId) => {
    let preferenceValue = 0;
    criteria.forEach((criteriaItem) => {
      const cellData = utilityMatrix[alternativeId]?.[criteriaItem.id];
      const utility = cellData?.utility || 0;
      const weight = criteriaItem.weight || 0;
      preferenceValue += utility * weight;
    });
    return preferenceValue;
  };

  // Pagination logic
  const totalPages = Math.ceil(alternatives.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlternatives = alternatives.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Show loading state if props are not yet available
  if (!alternatives || !criteria || !ratings) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="ml-2">Loading data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">SMART Preference Value</h2>
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, alternatives.length)} of {alternatives.length} alternatives
          </div>
        </div>

        {Object.keys(utilityMatrix).length > 0 && (
          <div className="p-4 bg-base-200 rounded-lg">
            <h3 className="font-semibold mb-2">Preference Value Calculation Formula:</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>Preference Value:</strong> Σ (Utility × Weight) for each criteria
              </p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="sticky left-0 bg-base-200 z-10">Alternative</th>
                {criteria.map((criteriaItem) => (
                  <th
                    key={criteriaItem.id}
                    className="text-center min-w-32"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{criteriaItem.name}</span>
                    </div>
                  </th>
                ))}
                <th className="text-center min-w-32 bg-primary text-primary-content">
                  <div className="flex flex-col">
                    <span className="font-semibold">Total</span>
                    <span className="text-xs opacity-70">Preference Value</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {alternatives.length === 0 ? (
                <tr>
                  <td
                    colSpan={criteria.length + 2}
                    className="text-center text-gray-500"
                  >
                    No alternatives found
                  </td>
                </tr>
              ) : (
                currentAlternatives.map((alternative) => (
                  <tr key={alternative.id}>
                    <td className="sticky left-0 bg-base-200 z-10 font-semibold">{alternative.name}</td>
                    {criteria.map((criteriaItem) => {
                      const cellData = utilityMatrix[alternative.id]?.[criteriaItem.id];
                      const utility = cellData?.utility || 0;
                      const weight = criteriaItem.weight || 0;
                      const weightedValue = utility * weight;

                      return (
                        <td
                          key={criteriaItem.id}
                          className="text-center"
                        >
                          <div className="flex flex-col items-center">
                            <div className="text-sm font-bold text-primary">{weightedValue.toFixed(3)}</div>
                            <div className="text-xs text-gray-500">
                              {utility.toFixed(3)} × {weight}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                    <td className="text-center bg-primary/10">
                      <div className="text-lg font-bold text-primary">
                        {calculatePreferenceValue(alternative.id).toFixed(3)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <div className="join">
              <button 
                className="join-item btn btn-sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`join-item btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              <button 
                className="join-item btn btn-sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
