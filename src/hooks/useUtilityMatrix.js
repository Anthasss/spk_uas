import { useState, useEffect } from "react";

export function useUtilityMatrix(alternatives, criteria, ratings) {
  const [utilityMatrix, setUtilityMatrix] = useState({});

  const getCriteriaType = (criteriaItem) => {
    if (criteriaItem.type) {
      return criteriaItem.type.toLowerCase();
    }
    return "benefit";
  };

  const getRatingValue = (alternativeId, criteriaId) => {
    const rating = ratings.find((r) => r.alternativeId === alternativeId && r.criteriaId === criteriaId);
    return rating?.subCriteria?.ratingValue || 0;
  };

  const calculateUtilityMatrix = () => {
    if (!alternatives || !criteria || !ratings) return;

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
            utilityValue = (max - rating) / (max - min);
          } else {
            utilityValue = (rating - min) / (max - min);
          }
        } else {
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

  useEffect(() => {
    calculateUtilityMatrix();
  }, [alternatives, criteria, ratings]);

  return utilityMatrix;
}