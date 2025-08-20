const API_BASE_URL = 'http://localhost:3001';

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name?: string;
    user_name?: string;
  };
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface SellerSignupData extends SignupData {
  companyName?: string;
  businessNumber?: string;
  companyPhone?: string;
  companyAddress?: string;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, userType: 'user' }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '로그인에 실패했습니다.');
    }

    const result = await response.json();
    return result.data; // Extract data from success response
  }

  async sellerLogin(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, userType: 'seller' }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '판매자 로그인에 실패했습니다.');
    }

    const result = await response.json();
    return result.data; // Extract data from success response
  }

  async signup(userData: SignupData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '회원가입에 실패했습니다.');
    }
  }

  async sellerSignup(sellerData: SellerSignupData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/seller-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sellerData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '판매자 회원가입에 실패했습니다.');
    }
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async verifyToken(): Promise<boolean> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): any {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  getCurrentSellerId(): number | null {
    const user = this.getCurrentUser();
    return user?.id || null;
  }
}

export const authService = new AuthService();

// Named exports for backward compatibility
export const login = authService.login.bind(authService);
export const sellerLogin = authService.sellerLogin.bind(authService);
export const signup = authService.signup.bind(authService);
export const sellerSignup = authService.sellerSignup.bind(authService);
export const logout = authService.logout.bind(authService);
export const verifyToken = authService.verifyToken.bind(authService);
export const getToken = authService.getToken.bind(authService);
export const isAuthenticated = authService.isAuthenticated.bind(authService);
export const getCurrentUser = authService.getCurrentUser.bind(authService);
export const getCurrentSellerId = authService.getCurrentSellerId.bind(authService);