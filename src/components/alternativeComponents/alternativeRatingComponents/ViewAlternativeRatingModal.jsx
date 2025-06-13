import { useState, useEffect } from "react";
import { getAlternativeRatingsByAlternativeId } from "../../../services/alternativeRatingService";
import EditAlternativeRatingModal from "./EditAlternativeRatingModal";

export default function ViewAlternativeRatingModal({ isOpen, onClose, alternative }) {
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch ratings when modal opens
  useEffect(() => {
    if (isOpen && alternative) {
      fetchRatings();
    }
  }, [isOpen, alternative]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const ratingsResponse = await getAlternativeRatingsByAlternativeId(alternative.id);
      const ratingsData = Array.isArray(ratingsResponse) ? ratingsResponse : ratingsResponse.data || ratingsResponse;
      setRatings(ratingsData);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    // Refresh ratings after edit
    fetchRatings();
  };

  const handleClose = () => {
    setRatings([]);
    onClose();
  };

  return (
    <>
      {/* Modal */}
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-lg mb-4">Ratings for {alternative?.nama || alternative?.name}</h3>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
              <span className="ml-2">Loading ratings...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Criteria</th>
                    <th>Selected Value</th>
                    <th>Rating Score</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center text-gray-500 py-8"
                      >
                        No ratings found for this alternative
                      </td>
                    </tr>
                  ) : (
                    ratings.map((rating, index) => (
                      <tr key={rating.id}>
                        <td>{index + 1}</td>
                        <td className="font-medium">{rating.criteria?.name || rating.criteriaId}</td>
                        <td>{rating.subCriteria?.realValue || rating.subCriteriaId}</td>
                        <td>
                          <span className="badge badge-primary">{rating.subCriteria?.ratingValue || "N/A"}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal Actions */}
          <div className="modal-action">
            {ratings.length > 0 && (
              <button
                className="btn btn-outline btn-warning"
                onClick={handleEditClick}
                disabled={loading}
              >
                Edit Ratings
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={handleClose}
              disabled={loading}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Edit Rating Modal */}
      {alternative && (
        <EditAlternativeRatingModal
          isOpen={isEditModalOpen}
          onClose={handleEditClose}
          alternative={alternative}
        />
      )}
    </>
  );
}
