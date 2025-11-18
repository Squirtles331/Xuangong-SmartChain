import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000
})

http.interceptors.request.use((config) => {
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
)

export default http
