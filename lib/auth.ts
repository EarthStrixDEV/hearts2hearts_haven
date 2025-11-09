// Direct Authentication System for CMS
// No NextAuth dependency - uses localStorage for client-side auth

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: string;
}

/**
 * Check if user is authenticated (client-side only)
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const user = localStorage.getItem('cms_user');
  return !!user;
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('cms_user');
    if (!userStr) return null;
    
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Set user in localStorage
 */
export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('cms_user', JSON.stringify(user));
}

/**
 * Remove user from localStorage (logout)
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('cms_user');
}

/**
 * Check if user has required role
 */
export function hasRole(requiredRole: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  const roles = ['AUTHOR', 'EDITOR', 'ADMIN'];
  const userLevel = roles.indexOf(user.role);
  const requiredLevel = roles.indexOf(requiredRole);
  
  return userLevel >= requiredLevel;
}

/**
 * Check if user can edit content
 */
export function canEdit(): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  return ['EDITOR', 'ADMIN'].includes(user.role);
}

/**
 * Check if user is admin
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  return user.role === 'ADMIN';
}

/**
 * Login function - calls the API and stores user data
 */
export async function login(username: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.user) {
      setCurrentUser(data.user);
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
  }
}

/**
 * Auth guard hook for protected pages
 */
export function useAuthGuard() {
  if (typeof window === 'undefined') return { isAuthenticated: false, user: null };
  
  const authenticated = isAuthenticated();
  const user = getCurrentUser();
  
  return { isAuthenticated: authenticated, user };
}
