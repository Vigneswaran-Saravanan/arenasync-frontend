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
import CreateVenuePage from './pages/CreateVenue/CreateVenuePage'
import VenueDetailPage from './pages/VenueDetail/VenueDetailPage'
import EditVenuePage from './pages/EditVenue/EditVenuePage'
import BrowseVenuesPage from './pages/BrowseVenues/BrowseVenuesPage'
import AdminPage from './pages/Admin/AdminPage'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import ProfilePage from './pages/Profile/ProfilePage'



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

        {/* Public routes — no login required */}
        <Route path="/register" element={<RegisterPage setRole={setRole} />} />
        <Route path="/login" element={<LoginPage setRole={setRole} />} />

        {/* Any logged-in user */}
        <Route path="/" element={
          <ProtectedRoute role={role}>
            <HomePage role={role} setRole={setRole} />
          </ProtectedRoute>
        } />

        <Route path="/match/:id" element={
          <ProtectedRoute role={role}>
            <MatchDetailPage role={role} setRole={setRole} />
          </ProtectedRoute>
        } />

        <Route path="/venue/:id" element={
          <ProtectedRoute role={role}>
            <VenueDetailPage role={role} setRole={setRole} />
          </ProtectedRoute>
        } />

        {/* Player or Organizer only */}
        <Route path="/my-matches" element={
          <ProtectedRoute role={role} allowedRoles={['Player', 'Organizer']}>
            <MyMatchesPage role={role} setRole={setRole} />
          </ProtectedRoute>
        } />

        {/* Organizer only */}
        <Route path="/create-match" element={
          <ProtectedRoute role={role} allowedRoles={['Organizer']}>
            <CreateMatchPage role={role} setRole={setRole} />
          </ProtectedRoute>
        } />

        <Route path="/organizer-match/:id" element={
          <ProtectedRoute role={role} allowedRoles={['Organizer']}>
            <OrganizerMatchPage role={role} setRole={setRole} />
          </ProtectedRoute>
        } />

        <Route path="/edit-match/:id" element={
          <ProtectedRoute role={role} allowedRoles={['Organizer']}>
            <EditMatchPage role={role} setRole={setRole} />
          </ProtectedRoute>
        } />

        <Route path="/browse-venues" element={
          <ProtectedRoute role={role} allowedRoles={['Organizer']}>
            <BrowseVenuesPage role={role} setRole={setRole} />
          </ProtectedRoute>
        } />

        {/* Venue Host only */}
        <Route path="/venue-dashboard" element={
          <ProtectedRoute role={role} allowedRoles={['Venue Host']}>
            <VenueDashboardPage role={role} setRole={setRole} />
          </ProtectedRoute>
        } />

        <Route path="/my-venues" element={
          <ProtectedRoute role={role} allowedRoles={['Venue Host']}>
            <MyVenuesPage role={role} setRole={setRole} />
          </ProtectedRoute>
        } />

        <Route path="/create-venue" element={
          <ProtectedRoute role={role} allowedRoles={['Venue Host']}>
            <CreateVenuePage role={role} setRole={setRole} />
          </ProtectedRoute>
        } />

        <Route path="/edit-venue/:id" element={
          <ProtectedRoute role={role} allowedRoles={['Venue Host']}>
            <EditVenuePage role={role} setRole={setRole} />
          </ProtectedRoute>
        } />

        {/* Any logged-in user */}
        <Route path="/profile" element={
          <ProtectedRoute role={role}>
            <ProfilePage role={role} setRole={setRole} />
          </ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path="/admin" element={
          <ProtectedRoute role={role} allowedRoles={['Admin']}>
            <AdminPage role={role} setRole={setRole} />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App