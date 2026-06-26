# ArenaSync — Frontend

Smart Soccer Matchmaking & Game Coordination Platform

---

## About

ArenaSync is a full-stack web application built to help local soccer players find, join and organize matches in their city. Instead of relying on WhatsApp groups and word of mouth, ArenaSync provides a centralized platform where players, organizers, venue hosts and administrators can all interact in one place.

This repository contains the React frontend of the application.

---

## Tech Stack

- React (Vite)
- React Router v6
- Axios
- Plain CSS
- JWT Authentication (stored in localStorage)
- Deployed on Vercel

---

## Features

- User registration and login with role-based access (Player, Organizer, Venue Host, Admin)
- Match listing with skill level, date and location filters
- Join request system with notification bell
- My Matches dashboard with Upcoming, Pending and Completed tabs
- Organizer match management — accept or decline requests, mark attendance
- Venue host dashboard — create listings and view upcoming bookings
- Admin panel — manage users, matches and venues
- Edit profile with position, skill level and city
- Attendance rate displayed on player profiles
- Protected routes — non-admin users cannot access the admin panel

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Vigneswaran-Saravanan/arenasync-frontend.git
cd arenasync-frontend/arenasync
npm install
```

### Environment Variables

Create a `.env` file inside the `arenasync/` folder:

```
VITE_API_URL=http://localhost:5000
```

For production point this to the live backend URL.

### Run Locally

```bash
npm run dev
```

Open http://localhost:5173

---

## Deployment

Deployed on Vercel. Every push to the `main` branch triggers an automatic redeployment.

The backend URL is configured via the `VITE_API_URL` environment variable set in the Vercel dashboard.

---

## Related

Backend Repository: https://github.com/Vigneswaran-Saravanan/arenasync-backend

---

## Author

Vigneswaran Saravanan
HTTP 5310 — Capstone Project
Humber Polytechnic, Summer 2026
