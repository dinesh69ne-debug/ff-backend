export default function Header() {
  return (
    <div className="text-center text-white relative">

      {/* Admin Button */}
      <button className="absolute right-0 top-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-md hover:opacity-90">
        Admin Panel
      </button>

      {/* Title */}
      <h1 className="text-4xl font-extrabold flex justify-center items-center gap-2">
        🏆 Free Fire Matches
      </h1>

      <p className="text-sm mt-2 opacity-90">
        Join a match and compete for victory!
      </p>
    </div>
  );
}