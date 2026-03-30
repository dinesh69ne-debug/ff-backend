import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackgroundLayout from "../components/BackgroundLayout";

const API = "https://ff-backend-gnas.onrender.com"; // 🔥 added

export default function PlayersPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/players/${id}`)   // 🔥 FIXED
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <BackgroundLayout>

      <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-md">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-orange-500 hover:underline"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          👥 Players
        </h2>

        {/* LOADING */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : players.length > 0 ? (

          players.map((p, i) => (
            <div
              key={i}
              className="border-b py-3 text-gray-800 flex flex-col"
            >
              {/* NAME */}
              <div className="font-medium">
                {i + 1}. {p.player_name}
              </div>

              {/* UID */}
              <div className="text-xs text-gray-500">
                UID: {p.player_uid || "Not provided"}
              </div>
            </div>
          ))

        ) : (
          <p className="text-center text-gray-500">
            No players approved yet
          </p>
        )}

      </div>

    </BackgroundLayout>
  );
}
