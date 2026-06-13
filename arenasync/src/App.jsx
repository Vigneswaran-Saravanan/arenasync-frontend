import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/Register/RegisterPage'
import LoginPage from './pages/Login/LoginPage'
import HomePage from './pages/Home/HomePage'
import MatchDetailPage from './pages/MatchDetail/MatchDetailPage'
import MyMatchesPage from './pages/MyMatches/MyMatchesPage'
import CreateMatchPage from './pages/CreateMatch/CreateMatchPage'
import OrganizerMatchPage from './pages/OrganizerMatch/OrganizerMatchPage'
import VenueDashboardPage from './pages/VenueDashboard/VenueDashboardPage'
import initialMatches from './data/matches'


function App() {

  // Try to load the logged-in user from localstorage
  // This keeps the user logged in even after the page refresh
  const storedUser = localStorage.getItem('user')
  const intialUser = storedUser ? JSON.parse(storedUser) : null 

  // Role comes form the logged-in user, default to 'Player' 
  const [role, setRole] = useState(intialUser ? intialUser.role : 'Player')

  // Stores all matches including new ones created by organizer
  const [allMatches, setAllMatches] = useState(initialMatches)

  // Called from CreateMatchPage when organizer submits a new match
  function addMatch(newMatch) {
    setAllMatches([...allMatches, newMatch])
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage setRole={setRole} />} />
        <Route path="/login" element={<LoginPage setRole={setRole} />} />
        <Route path="/" element={<HomePage role={role} setRole={setRole} matches={allMatches} />} />
        <Route path="/match/:id" element={<MatchDetailPage role={role} setRole={setRole} matches={allMatches} />} />
        <Route path="/my-matches" element={<MyMatchesPage role={role} setRole={setRole} />} />
        <Route path="/create-match" element={<CreateMatchPage role={role} setRole={setRole} addMatch={addMatch} />} />
        <Route path="/organizer-match/:id" element={<OrganizerMatchPage role={role} setRole={setRole} />} />
        <Route path="/venue-dashboard" element={<VenueDashboardPage role={role} setRole={setRole} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App