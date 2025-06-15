import AlternativeRatingTable from "../components/calculationComponents/AlternativeRatingTable";

export default function CalculationPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">SMART Calculation</h1>
      </div>

      <div className="space-y-6">
        <AlternativeRatingTable />
      </div>
    </div>
  );
}
