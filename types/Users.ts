export interface User {
  userId: string;
  username: string | null;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}