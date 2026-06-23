// Helpers to manage the Firebase token cookie
// Middleware reads this cookie to decide protected/public route access
import Cookies from "js-cookie";

const TOKEN_KEY = "fb_token";

// Save token after login — expires in 1 day (Firebase token auto-refreshes)
export const setAuthCookie  = (token: string) => Cookies.set(TOKEN_KEY, token, { expires: 1 });

// Remove token on logout
export const removeAuthCookie = () => Cookies.remove(TOKEN_KEY);

// Read token (used for API calls)
export const getAuthCookie = () => Cookies.get(TOKEN_KEY);
