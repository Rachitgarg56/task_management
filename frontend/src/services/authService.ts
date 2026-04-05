import api from './api';
import { tokenStorage } from '@/lib/tokens';
import { AuthTokens, User } from '@/types';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

const authService = {
  async register(payload: RegisterPayload): Promise<AuthTokens> {
    const { data } = await api.post('/auth/register', payload);
    const tokens: AuthTokens = data.data;
    tokenStorage.setAll(tokens.accessToken, tokens.refreshToken, tokens.user);
    return tokens;
  },

  async login(payload: LoginPayload): Promise<AuthTokens> {
    const { data } = await api.post('/auth/login', payload);
    const tokens: AuthTokens = data.data;
    tokenStorage.setAll(tokens.accessToken, tokens.refreshToken, tokens.user);
    return tokens;
  },

  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      try {
        await api.post('/auth/logout', { refreshToken });
      } catch {
        // Ignore errors on logout
      }
    }
    tokenStorage.clearAll();
  },

  getCurrentUser(): User | null {
    return tokenStorage.getUser<User>();
  },

  isAuthenticated(): boolean {
    return tokenStorage.isAuthenticated();
  },
};

export default authService;
