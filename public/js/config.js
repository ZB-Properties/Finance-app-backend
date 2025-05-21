
// Switch between development and production backend API
export const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:2600/api'
  : 'https://finance-app-backend-production-30b1.up.railway.app/api';