import { useState, useEffect } from "react";

export default function AlternativeRatingTable({ alternatives, criteria, ratings }) {
  const [ratingMatrix, setRatingMatrix] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (alternatives && criteria && ratings) {
      createRatingMatrix();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alternatives, criteria, ratings]);

  // Reset to first page when alternatives change
  useEffect(() => {
    setCurrentPage(1);
  }, [alternatives]);

  const createRatingMatrix = () => {
    // Create rating matrix: {alternativeId: {criteriaId: ratingValue}}
    const matrix = {};

    alternatives.forEach((alt) => {
      matrix[alt.id] = {};
    });

    ratings.forEach((rating) => {
      if (matrix[rating.alternativeId]) {
        matrix[rating.alternativeId][rating.criteriaId] = {
          ratingValue: rating.subCriteria?.ratingValue || 0,
          realValue: rating.subCriteria?.realValue || "N/A",
        };
      }
    });

    setRatingMatrix(matrix);
  };

  const getRatingForAlternativeCriteria = (alternativeId, criteriaId) => {
    const rating = ratingMatrix[alternativeId]?.[criteriaId];
    return rating || { ratingValue: 0, realValue: "N/A" };
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
            <span className="ml-2">Loading rating data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">Alternative Rating Matrix</h2>
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, alternatives.length)} of {alternatives.length} alternatives
          </div>
        </div>

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
                      <span className="text-xs opacity-70">Weight: {criteriaItem.weight}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alternatives.length === 0 ? (
                <tr>
                  <td
                    colSpan={criteria.length + 1}
                    className="text-center text-gray-500"
                  >
                    No alternatives found
                  </td>
                </tr>
              ) : (
                currentAlternatives.map((alternative) => (
                  <tr key={alternative.id}>
                    <td className="sticky left-0 bg-base-200 z-10 font-semibold">
                      {alternative.nama || alternative.name}
                    </td>
                    {criteria.map((criteriaItem) => {
                      const rating = getRatingForAlternativeCriteria(alternative.id, criteriaItem.id);
                      return (
                        <td
                          key={criteriaItem.id}
                          className="text-center"
                        >
                          <div className="flex flex-col items-center">
                            <span className={`badge ${rating.ratingValue > 0 ? "badge-primary" : "badge-ghost"}`}>
                              {rating.ratingValue}
                            </span>
                            <span className="text-xs opacity-70 mt-1">{rating.realValue}</span>
                          </div>
                        </td>
                      );
                    })}
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
