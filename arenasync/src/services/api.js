// Import axios
import axios from 'axios'

// The base URL of your backend
// API calls starts with this URL
const BASE_URL = 'http://localhost:5000/api'

// Create an axios with base URL
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type' : 'application/json',
    },
})

// Auth API calls

// Register a new user
export function registerUser(userData){
    return api.post('/auth/register', userData)
}

// Login an existing user
export function loginUser(credentials){
    return api.post('/auth/login', credentials)
}

export default api