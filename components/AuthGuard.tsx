"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getCurrentUser, User } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requiredRole, 
  redirectTo = "/cms/login" 
}: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push(redirectTo);
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push(redirectTo);
      return;
    }

    // Check role if required
    if (requiredRole) {
      const roles = ['AUTHOR', 'EDITOR', 'ADMIN'];
      const userLevel = roles.indexOf(currentUser.role);
      const requiredLevel = roles.indexOf(requiredRole);
      
      if (userLevel < requiredLevel) {
        router.push("/cms"); // Redirect to dashboard if insufficient permissions
        return;
      }
    }

    setUser(currentUser);
    setIsLoading(false);
  }, [router, requiredRole, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

// Hook for getting current user in components
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
