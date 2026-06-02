import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import MatchDetailPage from './pages/MatchDetail/MatchDetailPage'
import MyMatchesPage from './pages/MyMatches/MyMatchesPage'
import CreateMatchPage from './pages/CreateMatch/CreateMatchPage'
import OrganizerMatchPage from './pages/OrganizerMatch/OrganizerMatchPage'
import VenueDashboardPage from './pages/VenueDashboard/VenueDashboardPage'

function App() {
  const [role, setRole] = useState('Player')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage role={role} setRole={setRole} />} />
        <Route path="/match/:id" element={<MatchDetailPage role={role} setRole={setRole} />} />
        <Route path="/my-matches" element={<MyMatchesPage role={role} setRole={setRole} />} />
        <Route path="/create-match" element={<CreateMatchPage role={role} setRole={setRole} />} />
        <Route path="/organizer-match/:id" element={<OrganizerMatchPage role={role} setRole={setRole} />} />
        <Route path="/venue-dashboard" element={<VenueDashboardPage role={role} setRole={setRole} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App