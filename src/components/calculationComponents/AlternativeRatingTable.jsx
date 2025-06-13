import { useState, useEffect } from "react";
import { getAllAlternativeRatings } from "../../services/alternativeRatingService";
import { getAllAlternatives } from "../../services/alternativeService";
import { getAllCriteria } from "../../services/criteriaService";

export default function AlternativeRatingTable() {
  const [loading, setLoading] = useState(true);
  const [alternatives, setAlternatives] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [ratingMatrix, setRatingMatrix] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all required data
      const [alternativesResponse, criteriaResponse, ratingsResponse] = await Promise.all([
        getAllAlternatives(),
        getAllCriteria(),
        getAllAlternativeRatings(),
      ]);

      const alternativesData = alternativesResponse.data || alternativesResponse;
      const criteriaData = criteriaResponse.data || criteriaResponse;
      const ratingsData = Array.isArray(ratingsResponse) ? ratingsResponse : ratingsResponse.data || ratingsResponse;

      setAlternatives(alternativesData);
      setCriteria(criteriaData);

      // Create rating matrix: {alternativeId: {criteriaId: ratingValue}}
      const matrix = {};

      alternativesData.forEach((alt) => {
        matrix[alt.id] = {};
      });

      ratingsData.forEach((rating) => {
        if (matrix[rating.alternativeId]) {
          matrix[rating.alternativeId][rating.criteriaId] = {
            ratingValue: rating.subCriteria?.ratingValue || 0,
            realValue: rating.subCriteria?.realValue || "N/A",
          };
        }
      });

      setRatingMatrix(matrix);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load rating data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRatingForAlternativeCriteria = (alternativeId, criteriaId) => {
    const rating = ratingMatrix[alternativeId]?.[criteriaId];
    return rating || { ratingValue: 0, realValue: "N/A" };
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="alert alert-error">
            <span>{error}</span>
            <button
              className="btn btn-sm btn-outline"
              onClick={fetchData}
            >
              Retry
            </button>
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
          <button
            className="btn btn-sm btn-outline btn-primary"
            onClick={fetchData}
          >
            Refresh
          </button>
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
                alternatives.map((alternative) => (
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
      </div>
    </div>
  );
}
