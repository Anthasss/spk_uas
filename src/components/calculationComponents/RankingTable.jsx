import { useUtilityMatrix } from "../../hooks/useUtilityMatrix";

export default function RankingTable({ alternatives, criteria, ratings }) {
  const utilityMatrix = useUtilityMatrix(alternatives, criteria, ratings);

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

  // Sort alternatives by preference value in descending order
  const sortedAlternatives = [...alternatives].sort((a, b) => {
    const preferenceA = calculatePreferenceValue(a.id);
    const preferenceB = calculatePreferenceValue(b.id);
    return preferenceB - preferenceA; // Descending order
  });

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">SMART Ranking Results</h2>
        </div>

        {Object.keys(utilityMatrix).length > 0 && (
          <div className="p-4 bg-base-200 rounded-lg">
            <h3 className="font-semibold mb-2">Ranking Information:</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>Ranking:</strong> Alternatives sorted by preference value (highest to lowest)
              </p>
              <p>
                <strong>Best Alternative:</strong> The one with the highest preference value
              </p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="text-center min-w-16 bg-success text-success-content">
                  <div className="flex flex-col">
                    <span className="font-semibold">Rank</span>
                  </div>
                </th>
                <th className="sticky left-16 bg-base-200 z-10">Alternative</th>
                <th className="text-center min-w-32 bg-primary text-primary-content">
                  <div className="flex flex-col">
                    <span className="font-semibold">Preference Value</span>
                  </div>
                </th>
                {criteria.map((criteriaItem) => (
                  <th
                    key={criteriaItem.id}
                    className="text-center min-w-32"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{criteriaItem.name}</span>
                      <span className="text-xs opacity-70">U × W</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alternatives.length === 0 ? (
                <tr>
                  <td
                    colSpan={criteria.length + 3}
                    className="text-center text-gray-500"
                  >
                    No alternatives found
                  </td>
                </tr>
              ) : (
                sortedAlternatives.map((alternative, index) => {
                  const preferenceValue = calculatePreferenceValue(alternative.id);
                  const isFirst = index === 0;
                  
                  return (
                    <tr key={alternative.id} className={isFirst ? "bg-success/20" : ""}>
                      <td className="text-center bg-success/10">
                        <div className={`text-lg font-bold ${isFirst ? "text-success" : "text-primary"}`}>
                          #{index + 1}
                        </div>
                      </td>
                      <td className={`sticky left-16 bg-base-200 z-10 font-semibold ${isFirst ? "text-success" : ""}`}>
                        {alternative.name}
                        {isFirst && (
                          <div className="badge badge-success badge-sm ml-2">BEST</div>
                        )}
                      </td>
                      <td className="text-center bg-primary/10">
                        <div className={`text-lg font-bold ${isFirst ? "text-success" : "text-primary"}`}>
                          {preferenceValue.toFixed(3)}
                        </div>
                      </td>
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
                              <div className="text-sm font-bold text-primary">
                                {weightedValue.toFixed(3)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {utility.toFixed(3)} × {weight}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}