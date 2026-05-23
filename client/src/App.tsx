// App.tsx
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import TeamsPage from "./pages/TeamPage"
import PlayersPage from "./pages/PlayerPage"
import MatchesPage from "./pages/MatchesPage"
import AuctionPage from "./pages/AuctionPage"
import PlayerHomePage from "./pages/PlayerHomePage";
import AdminDashboard from "./adminDashboard/AdminDashboard";
import SeasonControlCenter from "./adminDashboard/SeasonControlCenter";
import SeasonAuctionPage from "./adminDashboard/SeasonAuction";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/players" element={<PlayersPage />} />
      <Route path="/matches" element={<MatchesPage />} />
      <Route path="/auction" element={<AuctionPage />} />
      <Route path="/players/:id" element={<PlayerHomePage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route
        path="/admin/seasons/:seasonId/control-center"
        element={<SeasonControlCenter />}
      />
      <Route
        path="/admin/seasons/:seasonId/auction"
        element={<SeasonAuctionPage />}
      />
    </Routes>
  );
}