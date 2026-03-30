import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackgroundLayout from "../components/BackgroundLayout";

const API = "https://ff-backend-gnas.onrender.com"; // 🔥 added

export default function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState<any>(null);

  useEffect(() => {
    fetch(`${API}/match/${id}`)   // 🔥 FIXED
      .then((res) => res.json())
      .then((data) => {
        console.log("MATCH DATA:", data);
        setMatch(data);
      })
      .catch((err) => console.log("Error:", err));
  }, [id]);

  return (
    <BackgroundLayout>
      <div className="max-w-md mx-auto bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-md text-center">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-orange-500 hover:underline"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Match Details
        </h2>

        {/* LOADING */}
        {!match ? (
          <p className="text-gray-500">Loading...</p>

        ) : (match.room_id && match.room_password) ? (

          <>
            {/* ROOM ID */}
            <div className="mb-6">
              <p className="text-gray-500">Room ID</p>
              <p className="text-3xl font-bold text-green-600 tracking-wide">
                {match.room_id}
              </p>
            </div>

            {/* PASSWORD */}
            <div>
              <p className="text-gray-500">Password</p>
              <p className="text-3xl font-bold text-red-500 tracking-wide">
                {match.room_password}
              </p>
            </div>
          </>

        ) : (
          <p className="text-gray-500 text-lg">
            Room details will be available soon
          </p>
        )}

      </div>
    </BackgroundLayout>
  );
}
