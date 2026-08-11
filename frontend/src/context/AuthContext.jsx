import React, { createContext, useState, useEffect } from 'react';
import { subscribeToAuthChanges, logoutUser } from '../firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Health Citizen',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL
        });
      } else {
        // Fallback default demo user for seamless zero-barrier testing
        setUser({
          uid: 'demo-user-123',
          name: 'Ram Kumar (Odisha)',
          email: 'ram.health@odisha.gov.in',
          isDemo: true
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Logout fallback:', e.message);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
