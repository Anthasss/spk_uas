import { useState, useEffect } from "react";
import { getAllCriteria } from "../../../services/criteriaService";
import { getSubCriteriaByCriteriaId } from "../../../services/subCriteriaService";
import { createAlternativeRating } from "../../../services/alternativeRatingService";

export default function AddAlternativeRatingModal({ isOpen, onClose, alternative }) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [criteria, setCriteria] = useState([]);
  const [subCriteriaMap, setSubCriteriaMap] = useState({});
  const [selectedRatings, setSelectedRatings] = useState({});

  // Fetch criteria and subcriteria when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCriteriaAndSubCriteria();
    }
  }, [isOpen]);

  const fetchCriteriaAndSubCriteria = async () => {
    try {
      setLoadingData(true);

      // Fetch all criteria
      const criteriaResponse = await getAllCriteria();
      const criteriaData = criteriaResponse.data || criteriaResponse;
      setCriteria(criteriaData);

      // Fetch subcriteria for each criteria
      const subCriteriaPromises = criteriaData.map(async (criteria) => {
        const subCriteriaResponse = await getSubCriteriaByCriteriaId(criteria.id);
        // The response is directly an array, not wrapped in data property
        const subCriteriaData = Array.isArray(subCriteriaResponse)
          ? subCriteriaResponse
          : subCriteriaResponse.data || subCriteriaResponse;
        return {
          criteriaId: criteria.id,
          subCriteria: subCriteriaData,
        };
      });

      const subCriteriaResults = await Promise.all(subCriteriaPromises);

      // Create a map of criteria ID to subcriteria (sorted by rating value)
      const subCriteriaMapping = {};
      subCriteriaResults.forEach(({ criteriaId, subCriteria }) => {
        // Sort subcriteria by ratingValue from largest to smallest
        const sortedSubCriteria = [...subCriteria].sort((a, b) => b.ratingValue - a.ratingValue);
        subCriteriaMapping[criteriaId] = sortedSubCriteria;
      });

      setSubCriteriaMap(subCriteriaMapping);

      // Initialize selected ratings object
      const initialRatings = {};
      criteriaData.forEach((criteria) => {
        initialRatings[criteria.id] = "";
      });
      setSelectedRatings(initialRatings);
    } catch (error) {
      console.error("Error fetching criteria and subcriteria:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleRatingChange = (criteriaId, subCriteriaId) => {
    setSelectedRatings((prev) => ({
      ...prev,
      [criteriaId]: subCriteriaId,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate that all criteria have selected subcriteria
      const unselectedCriteria = criteria.filter((c) => !selectedRatings[c.id]);
      if (unselectedCriteria.length > 0) {
        alert("Please select a subcriteria for all criteria");
        return;
      }

      // Create rating data for each criteria-subcriteria pair
      const ratingPromises = Object.entries(selectedRatings).map(async ([criteriaId, subCriteriaId]) => {
        const ratingData = {
          criteriaId: parseInt(criteriaId),
          subCriteriaId: parseInt(subCriteriaId),
          alternativeId: alternative.id,
        };

        return await createAlternativeRating(ratingData);
      });

      // Save all ratings
      await Promise.all(ratingPromises);

      console.log("Successfully saved all ratings for alternative:", alternative);
      alert("Ratings saved successfully!");

      onClose();
    } catch (error) {
      console.error("Error saving rating:", error);
      alert("Error saving ratings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedRatings({});
    onClose();
  };

  return (
    <>
      {/* Modal */}
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Add Rating for {alternative?.nama || alternative?.name}</h3>

          {loadingData ? (
            <div className="flex justify-center items-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
              <span className="ml-2">Loading criteria...</span>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {criteria.map((criteriaItem) => (
                <div
                  key={criteriaItem.id}
                  className="form-control w-full"
                >
                  <label className="label">
                    <span className="label-text font-semibold">{criteriaItem.name}</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={selectedRatings[criteriaItem.id] || ""}
                    onChange={(e) => handleRatingChange(criteriaItem.id, e.target.value)}
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select subcriteria for {criteriaItem.name}
                    </option>
                    {(subCriteriaMap[criteriaItem.id] || []).map((subCriteria) => (
                      <option
                        key={subCriteria.id}
                        value={subCriteria.id}
                      >
                        {subCriteria.realValue} (Rating: {subCriteria.ratingValue})
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {criteria.length === 0 && !loadingData && (
                <div className="text-center py-8 text-gray-500">No criteria found</div>
              )}
            </div>
          )}

          {/* Modal Actions */}
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={handleClose}
              disabled={loading || loadingData}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading || loadingData || criteria.length === 0}
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Save Rating"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
