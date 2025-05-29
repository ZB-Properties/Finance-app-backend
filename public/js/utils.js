export const authHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('Token in authHeaders():', token);
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};
