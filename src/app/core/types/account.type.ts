export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export interface UserDto {
  id: number;
  username: string;
  roles: string[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}