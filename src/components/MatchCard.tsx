import { useNavigate } from "react-router-dom";

interface Match {
  id: number;
  title: string;
  fee: number;
}

export default function MatchCard({ match }: { match: Match }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-sm hover:scale-[1.02] transition">

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-4 font-semibold text-lg">
        {match.title}
      </div>

      {/* Body */}
      <div className="p-5 space-y-5">

        {/* Entry Fee */}
        <div className="flex justify-between items-center text-gray-700">
          <span className="font-medium">💲 Entry Fee</span>
          <span className="font-bold text-orange-600 text-lg">₹{match.fee}</span>
        </div>

        {/* Slots */}
        <div className="flex justify-between items-center text-gray-700">
          <span className="font-medium">👥 Slots</span>
          <span className="font-semibold">10/10 left</span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-full bg-green-500"></div>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate(`/payment/${match.id}`)}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition"
        >
          Join Match
        </button>
      </div>
    </div>
  );
}