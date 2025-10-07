const API_URL = 'http://localhost:8080/fashion'; //https://srv594954.hstgr.cloud //https://4dj9sf39-5000.inc1.devtunnels.ms/

export const API_ROUTES = {
  baseURL: `${API_URL}`,
  login: `${API_URL}/login`,
  signup: `${API_URL}/signup`,
  displayImg: `https://srv594954.hstgr.cloud`,
  sessionCheck: `${API_URL}/api/verify-token`,
  forgotPassword: `${API_URL}/api/auth/forgot-password`,
  resetPassword: `${API_URL}/api/auth/reset-password`,
  sessionCheck: `${API_URL}/verifyToken`, // ✅ Use correct path for token verify
  saveUserDetails: `${API_URL}/save-details`,
  baseURL: `${API_URL}`
}