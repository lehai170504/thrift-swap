export interface AuthResponse {
  token: string;
  refreshToken?: string;
  id: string;
  username: string;
  email: string;
  role: string;
  fullName?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  interests?: string[];
  totalPoints?: number;
  tier?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    fullName?: string;
    avatar?: string;
    phone?: string;
    address?: string;
    interests?: string[];
  };
}

