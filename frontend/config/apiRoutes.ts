// Central place for all backend API endpoint URLs
// Change BASE_URL here and it updates everywhere
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";


const apiRoutes = {
  auth: {
    register: `${BASE_URL}/auth/register`,
    getUser : `${BASE_URL}/auth/get-user`,
  },
};

export default apiRoutes;
