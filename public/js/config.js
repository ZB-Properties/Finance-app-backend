
export const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:2600/api'
  : 'https://postgres-production-3629.up.railway.app/api';