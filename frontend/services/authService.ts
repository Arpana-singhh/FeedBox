// All auth-related API calls — login page imports from here, never calls fetch/axios directly
import { type AxiosResponse } from "axios";
import apiClient from "@/services/api/apiClient";
import apiRoutes from "@/config/apiRoutes";

type UserResponse = {
  uid          : string;
  email        : string;
  name         : string | null;
  emailVerified: boolean;
};

type RegisterResponse = {
  message: string;
  uid    : string;
  email  : string;
};

class AuthService {

  // Call backend /get-user with the Firebase token — returns logged-in user info
  static async getUser(token: string): Promise<AxiosResponse<UserResponse>> {
    return apiClient.get(apiRoutes.auth.getUser, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Call backend /register to create a new user via Firebase Admin SDK
  static async register(name: string, email: string, password: string): Promise<AxiosResponse<RegisterResponse>> {
    return apiClient.post(apiRoutes.auth.register, { name, email, password });
  }

}

export default AuthService;
