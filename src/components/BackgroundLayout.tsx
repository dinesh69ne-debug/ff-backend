export default function BackgroundLayout({ children }: any) {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg.jpg')",
      }}
    >
      <div className="min-h-screen bg-black/30 backdrop-blur-sm px-4 py-10">
        {children}
      </div>
    </div>
  );
}