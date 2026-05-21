'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'Super Admin' | 'Finance Admin' | 'Support Admin' | 'Analyst Admin';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  hasAccess: (path: string) => boolean;
  mounted: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  'Super Admin': ['*'],
  'Finance Admin': ['/admin/deposits', '/admin/withdrawals', '/admin/transactions', '/admin/plans', '/admin/audit', '/admin'],
  'Support Admin': ['/admin/users', '/admin/fraud', '/admin/notifications', '/admin/audit', '/admin'],
  'Analyst Admin': ['/admin', '/admin/referrals'],
};

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('Super Admin');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const savedRole = localStorage.getItem('adminRole') as Role;
    if (savedRole && Object.keys(ROLE_PERMISSIONS).includes(savedRole)) {
      setRole(savedRole);
    }
  }, []);

  const handleSetRole = (newRole: Role) => {
    setRole(newRole);
    localStorage.setItem('adminRole', newRole);
  };

  const hasAccess = (path: string) => {
    const allowed = ROLE_PERMISSIONS[role];
    if (allowed.includes('*')) return true;
    
    // exact matches or child paths
    return allowed.some(allowedPath => {
      if (allowedPath === '/admin') {
        return path === '/admin';
      }
      return path.startsWith(allowedPath);
    });
  };

  return (
    <RoleContext.Provider value={{ role, setRole: handleSetRole, hasAccess, mounted }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within RoleProvider');
  return context;
};
