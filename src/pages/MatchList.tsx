import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundLayout from "../components/BackgroundLayout";

const API = "https://ff-backend-gnas.onrender.com"; // 🔥 added

export default function MatchList() {
  const [matches, setMatches] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = () => {
      fetch(`${API}/matches`)   // 🔥 FIXED
        .then((res) => res.json())
        .then((data) => setMatches(data))
        .catch((err) => console.error("Error fetching matches:", err));
    };

    fetchMatches();
    const interval = setInterval(fetchMatches, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BackgroundLayout>

      <div className="max-w-6xl mx-auto text-center text-white mb-10">
        <h1 className="text-4xl font-bold drop-shadow-lg">
          🏆 Free Fire Matches
        </h1>
        <p className="mt-2 text-gray-200">
          Join and compete for victory
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {matches.map((match) => {
          const slotsLeft = match.total_slots - match.filled_slots;
          const isFull = slotsLeft <= 0;

          return (
            <div
              key={match.id}
              className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-md overflow-hidden flex flex-col justify-between transition duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
            >
              {/* TITLE */}
              <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white p-4 font-semibold">
                {match.title}
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col justify-between h-full">

                <div className="space-y-3">

                  <div className="flex justify-between text-gray-700">
                    <span>Entry Fee</span>
                    <span className="font-bold text-orange-500">
                      ₹{match.fee}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Slots</span>
                    <span>
                      {slotsLeft}/{match.total_slots}
                    </span>
                  </div>

                  {/* PROGRESS */}
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${(match.filled_slots / match.total_slots) * 100}%`,
                      }}
                    ></div>
                  </div>

                </div>

                <div className="mt-4 space-y-2">

                  <button
                    disabled={isFull}
                    onClick={() => navigate(`/payment/${match.id}`)}
                    className={`w-full py-2 rounded-lg text-white ${
                      isFull
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-400 to-red-400 hover:opacity-90"
                    }`}
                  >
                    {isFull ? "Match Full" : "Join Match"}
                  </button>

                  <button
                    onClick={() => navigate(`/players/${match.id}`)}
                    className="w-full py-2 rounded-lg text-white bg-gradient-to-r from-orange-400 to-red-400 hover:opacity-90"
                  >
                    View Players
                  </button>

                  <button
                    onClick={() => navigate(`/match/${match.id}`)}
                    className="w-full py-2 rounded-lg text-white bg-gradient-to-r from-orange-400 to-red-400 hover:opacity-90"
                  >
                    Match Details
                  </button>

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </BackgroundLayout>
  );
}
