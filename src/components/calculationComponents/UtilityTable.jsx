import { useState, useEffect } from "react";

export default function UtilityTable({ alternatives, criteria, ratings }) {
  const [utilityMatrix, setUtilityMatrix] = useState({});

  useEffect(() => {
    if (alternatives && criteria && ratings) {
      calculateUtilityMatrix();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alternatives, criteria, ratings]);

  // Function to detect if a criteria is benefit or cost based on the JSON data
  const getCriteriaType = (criteriaItem) => {
    if (criteriaItem.type) {
      return criteriaItem.type.toLowerCase();
    }
    return "benefit";
  };

  // Function to get rating value for a specific alternative and criteria
  const getRatingValue = (alternativeId, criteriaId) => {
    const rating = ratings.find((r) => r.alternativeId === alternativeId && r.criteriaId === criteriaId);
    return rating?.subCriteria?.ratingValue || 0;
  };

  // Function to calculate utility matrix
  const calculateUtilityMatrix = () => {
    const matrix = {};

    // Calculate min and max for each criteria
    const criteriaStats = {};
    criteria.forEach((criterion) => {
      const values = alternatives.map((alt) => getRatingValue(alt.id, criterion.id));
      criteriaStats[criterion.id] = {
        min: Math.min(...values),
        max: Math.max(...values),
        type: getCriteriaType(criterion),
      };
    });

    // Calculate utility values for each alternative-criteria combination
    alternatives.forEach((alternative) => {
      matrix[alternative.id] = {};

      criteria.forEach((criterion) => {
        const rating = getRatingValue(alternative.id, criterion.id);
        const { min, max, type } = criteriaStats[criterion.id];

        let utilityValue = 0;

        if (max !== min) {
          if (type === "cost") {
            // For cost criteria: (max - rating) / (max - min)
            utilityValue = (max - rating) / (max - min);
          } else {
            // For benefit criteria: (rating - min) / (max - min)
            utilityValue = (rating - min) / (max - min);
          }
        } else {
          // If all values are the same, utility is 1
          utilityValue = 1;
        }

        matrix[alternative.id][criterion.id] = {
          rating: rating,
          utility: utilityValue,
          min: min,
          max: max,
          type: type,
        };
      });
    });

    setUtilityMatrix(matrix);
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
          <h2 className="card-title">SMART Utility Table</h2>
        </div>

        {Object.keys(utilityMatrix).length > 0 && (
          <div className="p-4 bg-base-200 rounded-lg">
            <h3 className="font-semibold mb-2">Utility Calculation Formulas:</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>Cost criteria:</strong> (Max - Rating) / (Max - Min)
              </p>
              <p>
                <strong>Benefit criteria:</strong> (Rating - Min) / (Max - Min)
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
                      <span className="text-xs opacity-70">W = {criteriaItem.weight}</span>
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
                    <td className="sticky left-0 bg-base-200 z-10 font-semibold">{alternative.name}</td>
                    {criteria.map((criteriaItem) => {
                      const cellData = utilityMatrix[alternative.id]?.[criteriaItem.id];
                      return (
                        <td
                          key={criteriaItem.id}
                          className="text-center"
                        >
                          <div className="flex flex-col items-center">
                            <div className="text-sm font-bold text-primary">
                              {cellData?.utility ? cellData.utility.toFixed(3) : "0.000"}
                            </div>
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
