import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
export const AuthContext = createContext(null);

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Verify token with backend
        const response = await fetch('/api/verify-token', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // If token is invalid, clear it
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Get auth header for API calls
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      // Register the user
      const registerResponse = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || 'Registration failed');
      }

      // Call allocate API after successful registration
      const allocateResponse = await fetch('/api/allocate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${registerData.token}`
        },
        body: JSON.stringify({ userId: registerData.user.id })
      });

      if (!allocateResponse.ok) {
        throw new Error('Resource allocation failed');
      }

      // Automatically log in the user after successful registration
      localStorage.setItem('token', registerData.token);
      setUser(registerData.user);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };


  const value = {
    user,
    login,
    register,
    loading,
    error,
    logout,
    getAuthHeader,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <div>Loading...</div>; // Or your custom loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};