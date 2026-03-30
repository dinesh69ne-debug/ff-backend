import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackgroundLayout from "../components/BackgroundLayout";

const API = "https://ff-backend-gnas.onrender.com"; // 🔥 added

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Enter your Free Fire name");
      return;
    }

    if (!uid.trim()) {
      alert("Enter your Free Fire UID");
      return;
    }

    if (!phone.match(/^[0-9]{10}$/)) {
      alert("Enter valid 10-digit phone number");
      return;
    }

    if (!file) {
      alert("Upload payment screenshot");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("player_uid", uid);
      formData.append("phone", phone);
      formData.append("match_id", id || "");
      formData.append("screenshot", file);

      const res = await fetch(`${API}/submit`, {   // 🔥 FIXED
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        alert("❌ Submission failed");
      }

    } catch (err) {
      console.log(err);
      alert("⚠️ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout>

      {/* ✅ SUCCESS SCREEN */}
      {success && (
        <div className="fixed inset-0 bg-gradient-to-br from-green-400 to-green-600 flex flex-col items-center justify-center z-50 text-white">

          <div className="text-6xl mb-4 animate-bounce">
            ✔
          </div>

          <h2 className="text-2xl font-bold mb-2">
            Submitted Successfully
          </h2>

          <p className="text-lg">
            Wait for approval
          </p>

          <p className="text-sm mt-2">
            Redirecting...
          </p>

        </div>
      )}

      {/* PAYMENT BOX */}
      <div className="max-w-md mx-auto bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-md">

        <h2 className="text-xl font-bold mb-4 text-center">
          Payment
        </h2>

        <input
          type="text"
          placeholder="Enter Free Fire Name"
          className="w-full border p-2 mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Free Fire UID"
          className="w-full border p-2 mb-3 rounded"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border p-2 mb-4 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <p className="text-center font-semibold mb-2 text-gray-700">
          Scan & Pay
        </p>

        <img
          src="/qr.png"
          alt="QR"
          className="w-40 mx-auto mb-4"
        />

        <p className="font-semibold text-gray-700 mb-1">
          Upload Payment Screenshot
        </p>

        <input
          type="file"
          className="w-full mb-4"
          onChange={(e: any) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !name || !phone || !file || !uid}
          className={`w-full py-2 rounded-lg text-white transition ${
            loading || !name || !phone || !file || !uid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-400 to-red-400 hover:opacity-90"
          }`}
        >
          {loading ? "Submitting..." : "Submit Payment"}
        </button>

      </div>

    </BackgroundLayout>
  );
}
