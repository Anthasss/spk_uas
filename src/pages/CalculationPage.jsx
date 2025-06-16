import { useState, useEffect } from "react";
import { getAllAlternatives } from "../services/alternativeService";
import { getAllCriteria } from "../services/criteriaService";
import { getAllAlternativeRatings } from "../services/alternativeRatingService";
import AlternativeRatingTable from "../components/calculationComponents/AlternativeRatingTable";
import UtilityTable from "../components/calculationComponents/UtilityTable";
import PreferenceTable from "../components/calculationComponents/PreferenceTable";
import RankingTable from "../components/calculationComponents/RankingTable";

export default function CalculationPage() {
  const [loading, setLoading] = useState(true);
  const [alternatives, setAlternatives] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [ratings, setRatings] = useState([]);
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
      setRatings(ratingsData);

      console.log("Criteria:", criteriaData);
      console.log("Alternatives:", alternativesData);
      console.log("Rating", ratingsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load calculation data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">SMART Calculation</h1>
        </div>
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-2">Loading calculation data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">SMART Calculation</h1>
        </div>
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
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">SMART Calculation</h1>
        <button
          className="btn btn-primary"
          onClick={fetchData}
        >
          Refresh Data
        </button>
      </div>

      <div className="space-y-6">
        <AlternativeRatingTable
          alternatives={alternatives}
          criteria={criteria}
          ratings={ratings}
        />

        <UtilityTable
          alternatives={alternatives}
          criteria={criteria}
          ratings={ratings}
        />

        <PreferenceTable
          alternatives={alternatives}
          criteria={criteria}
          ratings={ratings}
        />

        <RankingTable
          alternatives={alternatives}
          criteria={criteria}
          ratings={ratings}
        />
      </div>
    </div>
  );
}
