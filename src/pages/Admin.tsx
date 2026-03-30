import { useEffect, useState } from "react";

const API = "https://ff-backend-gnas.onrender.com"; // 🔥 added

export default function Admin() {
  const [data, setData] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [newMatch, setNewMatch] = useState({
    title: "",
    fee: "",
    total_slots: "",
  });

  const fetchData = async () => {
    const res = await fetch(`${API}/submissions`);   // 🔥 FIXED
    setData(await res.json());
  };

  const fetchMatches = async () => {
    const res = await fetch(`${API}/matches`);   // 🔥 FIXED
    setMatches(await res.json());
  };

  useEffect(() => {
    fetchData();
    fetchMatches();
  }, []);

  const approve = async (item: any) => {
    await fetch(`${API}/approve`, {   // 🔥 FIXED
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: item.id }),
    });

    fetchData();
  };

  const updateMatch = async (m: any) => {
    await fetch(`${API}/update-match/${m.id}`, {   // 🔥 FIXED
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: m.title,
        fee: m.fee,
        total_slots: m.total_slots,
        room_id: m.room_id || "",
        room_password: m.room_password || "",
      }),
    });

    alert("Updated!");
  };

  const deleteMatch = async (id: number) => {
    if (!confirm("Delete this match?")) return;

    await fetch(`${API}/delete-match/${id}`, {   // 🔥 FIXED
      method: "DELETE",
    });

    fetchMatches();
  };

  const createMatch = async () => {
    if (!newMatch.title || !newMatch.fee || !newMatch.total_slots) {
      alert("Fill all fields");
      return;
    }

    await fetch(`${API}/create-match`, {   // 🔥 FIXED
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMatch),
    });

    setNewMatch({ title: "", fee: "", total_slots: "" });
    fetchMatches();
  };

  const clearAll = async () => {
    if (!confirm("Delete ALL submissions?")) return;

    await fetch(`${API}/clear-submissions`, {   // 🔥 FIXED
      method: "DELETE",
    });

    fetchData();
  };

  const filteredData = data.filter((item) => {
    const matchesFilter =
      filter === "all" || item.status === filter;

    const matchesSearch =
      item.player_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.includes(search) ||
      item.player_uid?.includes(search);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* CREATE MATCH */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-bold mb-3">Create Match</h2>

        <input
          placeholder="Title"
          value={newMatch.title}
          onChange={(e) =>
            setNewMatch({ ...newMatch, title: e.target.value })
          }
          className="border p-2 mr-2 mb-2"
        />

        <input
          placeholder="Fee"
          value={newMatch.fee}
          onChange={(e) =>
            setNewMatch({ ...newMatch, fee: e.target.value })
          }
          className="border p-2 mr-2 mb-2"
        />

        <input
          placeholder="Slots"
          value={newMatch.total_slots}
          onChange={(e) =>
            setNewMatch({ ...newMatch, total_slots: e.target.value })
          }
          className="border p-2 mr-2 mb-2"
        />

        <button
          onClick={createMatch}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Match
        </button>
      </div>

      {/* MATCHES */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {matches.map((m, i) => (
          <div key={m.id} className="bg-white p-4 rounded shadow">

            <input
              value={m.title}
              onChange={(e) => {
                const updated = [...matches];
                updated[i].title = e.target.value;
                setMatches(updated);
              }}
              className="border p-2 mb-2 w-full"
            />

            <input
              value={m.fee}
              onChange={(e) => {
                const updated = [...matches];
                updated[i].fee = e.target.value;
                setMatches(updated);
              }}
              className="border p-2 mb-2 w-full"
            />

            <input
              value={m.total_slots}
              onChange={(e) => {
                const updated = [...matches];
                updated[i].total_slots = e.target.value;
                setMatches(updated);
              }}
              className="border p-2 mb-2 w-full"
            />

            <input
              placeholder="Room ID"
              value={m.room_id || ""}
              onChange={(e) => {
                const updated = [...matches];
                updated[i].room_id = e.target.value;
                setMatches(updated);
              }}
              className="border p-2 mb-2 w-full"
            />

            <input
              placeholder="Room Password"
              value={m.room_password || ""}
              onChange={(e) => {
                const updated = [...matches];
                updated[i].room_password = e.target.value;
                setMatches(updated);
              }}
              className="border p-2 mb-2 w-full"
            />

            <button
              onClick={() => updateMatch(m)}
              className="w-full bg-blue-500 text-white py-2 rounded mb-2"
            >
              Save
            </button>

            <button
              onClick={() => deleteMatch(m.id)}
              className="w-full bg-red-500 text-white py-2 rounded"
            >
              Delete
            </button>

          </div>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">

        <input
          type="text"
          placeholder="Search name / phone / UID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/2"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>

        <button
          onClick={clearAll}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear All
        </button>

      </div>

      {/* SUBMISSIONS */}
      <div className="grid gap-4 md:grid-cols-3">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow">

            <p><b>Name:</b> {item.player_name}</p>
            <p><b>UID:</b> {item.player_uid}</p>
            <p><b>Phone:</b> {item.phone}</p>
            <p><b>Match:</b> {item.match_title}</p>

            <p>
              <b>Status:</b>{" "}
              <span className={item.status === "approved" ? "text-green-600" : "text-orange-500"}>
                {item.status}
              </span>
            </p>

            <img
              src={item.screenshot}
              onClick={() => setSelectedImage(item.screenshot)}
              className="w-full h-32 object-cover mt-2 rounded cursor-pointer"
            />

            <button
              onClick={() => approve(item)}
              className={`w-full mt-2 py-2 text-white rounded ${
                item.status === "approved" ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {item.status === "approved" ? "Remove" : "Approve"}
            </button>

          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="max-w-[90%] max-h-[90%] rounded-lg"
          />
        </div>
      )}

    </div>
  );
}
