import axios from 'axios'
import { useStore } from '../store/useStore'

// The Axios instance targets the proxy endpoint /api defined in vite.config.ts
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach Supabase auth token automatically to requests
api.interceptors.request.use(
  (config) => {
    const token = useStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
