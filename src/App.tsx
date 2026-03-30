import { BrowserRouter, Routes, Route } from "react-router-dom";
import MatchList from "./pages/MatchList";
import Payment from "./pages/Payment";
import Admin from "./pages/Admin";
import PlayersPage from "./pages/PlayersPage";
import MatchDetails from "./pages/MatchDetailsPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MatchList />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/players/:id" element={<PlayersPage />} />
        <Route path="/match/:id" element={<MatchDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;