import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken, removeAuthToken, setStoredOrgId, getStoredOrgId } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [currentOrg, setCurrentOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.success && res.data) {
        const userData = res.data.user || res.data;
        setUser(userData);
        setPermissions(res.data.permissions || userData.permissions || []);
        const orgs = res.data.organizations || userData.organizations || [];
        setOrganizations(orgs);
        
        // Match current org or fall back to user's primary org
        const storedOrgId = getStoredOrgId();
        const activeOrg = orgs.find(o => o.id === storedOrgId) || 
                          userData.organization || 
                          orgs[0];
        
        if (activeOrg) {
          setCurrentOrg(activeOrg);
          setStoredOrgId(activeOrg.id);
        }
      }
    } catch (err) {
      console.warn('Session expired or not authenticated:', err.message);
      removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    localStorage.removeItem('bizai_org_id');
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data) {
      setAuthToken(res.data.token);
      const userData = res.data.user || res.data;
      setUser(userData);
      if (userData.organization) {
        setCurrentOrg(userData.organization);
        setStoredOrgId(userData.organization.id);
      }
      if (res.data.permissions || userData.permissions) {
        setPermissions(res.data.permissions || userData.permissions);
      }
      await fetchCurrentUser();
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (formData) => {
    localStorage.removeItem('bizai_org_id');
    const res = await api.post('/auth/register', formData);
    if (res.success && res.data) {
      setAuthToken(res.data.token);
      const userData = res.data.user || res.data;
      setUser(userData);
      if (userData.organization) {
        setCurrentOrg(userData.organization);
        setStoredOrgId(userData.organization.id);
      }
      await fetchCurrentUser();
      return userData;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const switchOrganization = async (orgId) => {
    setStoredOrgId(orgId);
    const org = organizations.find(o => o.id === orgId);
    if (org) setCurrentOrg(org);
    await fetchCurrentUser();
    window.location.reload(); // Reload context for clean multi-tenant refresh
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem('bizai_org_id');
    setUser(null);
    setPermissions([]);
    setCurrentOrg(null);
    window.location.href = '/login';
  };

  const hasPermission = (permCode) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return true;
    return permissions.includes(permCode);
  };

  const hasRole = (roleCode) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return user.role === roleCode;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        currentOrg,
        organizations,
        permissions,
        login,
        register,
        logout,
        switchOrganization,
        hasPermission,
        hasRole,
        refreshUser: fetchCurrentUser,
        isAuthenticated: Boolean(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
