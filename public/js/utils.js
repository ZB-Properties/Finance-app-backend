export const getToken = () => localStorage.getItem('token');

export const authHeaders = () => ({
  'Authorization': `Bearer ${getToken()}`,
  'Content-Type': 'application/json'
});
