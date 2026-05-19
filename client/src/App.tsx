// App.tsx
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import TeamsPage from "./pages/TeamPage"
import PlayersPage from "./pages/PlayerPage"
import MatchesPage from "./pages/MatchesPage"
import AuctionPage from "./pages/AuctionPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/players" element={<PlayersPage />} />
      <Route path="/matches" element={<MatchesPage />} />
      <Route path="/auction" element={<AuctionPage />} />
    </Routes>
  );
}