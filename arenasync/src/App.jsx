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
import EditMatchPage from './pages/EditMatch/EditMatchPage'
import MyVenuesPage from './pages/MyVenues/MyVenuesPage'



function App() {

  // Try to load the logged-in user from localstorage
  // This keeps the user logged in even after the page refresh
  const storedUser = localStorage.getItem('user')
  const initialUser = storedUser ? JSON.parse(storedUser) : null 

  // Role comes form the logged-in user, default to 'Player' 
  const [role, setRole] = useState(initialUser ? initialUser.role : 'Player')

  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage setRole={setRole} />} />
        <Route path="/login" element={<LoginPage setRole={setRole} />} />
        <Route path="/" element={<HomePage role={role} setRole={setRole} />} />
        <Route path="/match/:id" element={<MatchDetailPage role={role} setRole={setRole} />} />
        <Route path="/my-matches" element={<MyMatchesPage role={role} setRole={setRole} />} />
        <Route path="/create-match" element={<CreateMatchPage role={role} setRole={setRole} />} />
        <Route path="/organizer-match/:id" element={<OrganizerMatchPage role={role} setRole={setRole} />} />
        <Route path="/edit-match/:id" element={<EditMatchPage role={role} setRole={setRole} />} />
        <Route path="/venue-dashboard" element={<VenueDashboardPage role={role} setRole={setRole} />} />
        <Route path="/my-venues" element={<MyVenuesPage role={role} setRole={setRole} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App