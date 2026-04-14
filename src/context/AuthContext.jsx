import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest, IS_FRONTEND_ONLY } from '../api/client';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext(null);
const DEMO_ADMIN_EMAIL = 'admin@raesboutique.com';
const DEMO_ADMIN_PASSWORD = 'Admin@123';
const DEMO_SIGNUP_STORAGE_KEY = 'raes-demo-users';

const normalizeAddress = (address = {}) => ({
  fullName: address?.fullName || '',
  addressLine1: address?.addressLine1 || '',
  addressLine2: address?.addressLine2 || '',
  city: address?.city || '',
  state: address?.state || '',
  postalCode: address?.postalCode || '',
  country: address?.country || 'India'
});

const normalizeWishlist = (wishlist = []) =>
  wishlist.map((item) => (typeof item === 'string' ? item : item._id));

const normalizeUser = (user) => ({
  ...user,
  phone: user?.phone || '',
  address: normalizeAddress(user?.address),
  wishlist: normalizeWishlist(user?.wishlist)
});

const isServerUnavailableError = (message = '') =>
  IS_FRONTEND_ONLY ||
  message === 'Cannot reach the Raes Boutique server. Make sure the backend is running.' ||
  message === 'Resource not found.' ||
  message.startsWith('Request failed with status 5');

const upsertDemoUserRecord = (currentUsers, record) => {
  const existingIndex = currentUsers.findIndex((demoUser) => demoUser.email === record.email);

  if (existingIndex === -1) {
    return [...currentUsers, record];
  }

  const nextUsers = [...currentUsers];
  nextUsers[existingIndex] = {
    ...nextUsers[existingIndex],
    ...record
  };

  return nextUsers;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage('raes-token', '');
  const [storedUser, setStoredUser] = useLocalStorage('raes-user', null);
  const [guestWishlist, setGuestWishlist] = useLocalStorage('raes-guest-wishlist', []);
  const [demoUsers, setDemoUsers] = useLocalStorage(DEMO_SIGNUP_STORAGE_KEY, []);
  const [isLoading, setIsLoading] = useState(false);

  const user = storedUser
    ? {
        ...storedUser,
        wishlist: normalizeWishlist(storedUser.wishlist)
      }
    : null;

  const canUseLocalAuth = import.meta.env.DEV || IS_FRONTEND_ONLY;

  const refreshProfile = async () => {
    if (!token) {
      return;
    }

    setIsLoading(true);

    try {
      const profile = await apiRequest('/auth/profile', { token });
      setStoredUser(normalizeUser(profile));
    } catch (error) {
      setToken('');
      setStoredUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && !storedUser) {
      refreshProfile();
    }
  }, [token]);

  const login = async (credentials) => {
    setIsLoading(true);
    const normalizedCredentials = {
      ...credentials,
      email: credentials.email?.trim().toLowerCase() || ''
    };

    try {
      if (IS_FRONTEND_ONLY) {
        const instantAdminUser = {
          _id: 'demo-admin',
          name: 'Raes Admin',
          email: normalizedCredentials.email || DEMO_ADMIN_EMAIL,
          phone: '',
          role: 'admin',
          address: normalizeAddress(),
          wishlist: [],
          isDemoMode: true
        };

        setToken('demo-admin-token');
        setStoredUser(instantAdminUser);
        return instantAdminUser;
      }

      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: normalizedCredentials
      });

      setToken(data.token);
      setStoredUser(normalizeUser(data.user));
      setDemoUsers((current) =>
        upsertDemoUserRecord(current, {
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '',
          address: normalizeAddress(data.user.address),
          password: normalizedCredentials.password,
          wishlist: normalizeWishlist(data.user.wishlist),
          createdAt: data.user.createdAt || new Date().toISOString()
        })
      );

      return data.user;
    } catch (error) {
      const matchedDemoUser =
        canUseLocalAuth &&
        demoUsers.find(
          (demoUser) =>
            demoUser.email === normalizedCredentials.email && demoUser.password === normalizedCredentials.password
        );

      const isDemoAdminLogin =
        canUseLocalAuth &&
        normalizedCredentials.email === DEMO_ADMIN_EMAIL &&
        normalizedCredentials.password === DEMO_ADMIN_PASSWORD &&
        isServerUnavailableError(error.message);

      if (isDemoAdminLogin) {
        const demoUser = {
          _id: 'demo-admin',
          name: 'Raes Admin',
          email: DEMO_ADMIN_EMAIL,
          phone: '',
          role: 'admin',
          address: normalizeAddress(),
          wishlist: [],
          isDemoMode: true
        };

        setToken('demo-admin-token');
        setStoredUser(demoUser);

        return demoUser;
      }

      if (!matchedDemoUser) {
        throw error;
      }

      const demoUser = {
        _id: matchedDemoUser._id,
        name: matchedDemoUser.name,
        email: matchedDemoUser.email,
        phone: matchedDemoUser.phone || '',
        address: normalizeAddress(matchedDemoUser.address),
        role: 'user',
        wishlist: matchedDemoUser.wishlist || [],
        isDemoMode: true
      };

      setToken(`demo-user-token:${matchedDemoUser.email}`);
      setStoredUser(demoUser);

      return demoUser;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload) => {
    setIsLoading(true);
    const normalizedPayload = {
      ...payload,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone?.trim() || '',
      address: normalizeAddress(payload.address)
    };

    try {
      if (IS_FRONTEND_ONLY) {
        const existingDemoUser = demoUsers.find((demoUser) => demoUser.email === normalizedPayload.email);

        if (existingDemoUser) {
          throw new Error('An account already exists with this email.');
        }

        const demoUserRecord = {
          _id: `demo-user-${Date.now()}`,
          name: normalizedPayload.name,
          email: normalizedPayload.email,
          phone: normalizedPayload.phone,
          address: normalizeAddress(normalizedPayload.address),
          password: normalizedPayload.password,
          wishlist: [],
          createdAt: new Date().toISOString()
        };

        setDemoUsers((current) => [...current, demoUserRecord]);
        setToken(`demo-user-token:${demoUserRecord.email}`);
        setStoredUser({
          _id: demoUserRecord._id,
          name: demoUserRecord.name,
          email: demoUserRecord.email,
          phone: demoUserRecord.phone,
          address: normalizeAddress(demoUserRecord.address),
          role: 'user',
          wishlist: [],
          isDemoMode: true
        });

        return {
          _id: demoUserRecord._id,
          name: demoUserRecord.name,
          email: demoUserRecord.email,
          phone: demoUserRecord.phone,
          address: normalizeAddress(demoUserRecord.address),
          role: 'user',
          wishlist: []
        };
      }

      const data = await apiRequest('/auth/signup', {
        method: 'POST',
        body: normalizedPayload
      });

      setToken(data.token);
      setStoredUser(normalizeUser(data.user));
      setDemoUsers((current) =>
        upsertDemoUserRecord(current, {
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || normalizedPayload.phone,
          address: normalizeAddress(data.user.address || normalizedPayload.address),
          password: normalizedPayload.password,
          wishlist: normalizeWishlist(data.user.wishlist),
          createdAt: data.user.createdAt || new Date().toISOString()
        })
      );

      return data.user;
    } catch (error) {
      const shouldUseDemoSignup = canUseLocalAuth && isServerUnavailableError(error.message);

      if (!shouldUseDemoSignup) {
        throw error;
      }

      const existingDemoUser = demoUsers.find((demoUser) => demoUser.email === normalizedPayload.email);

      if (existingDemoUser) {
        throw new Error('An account already exists with this email.');
      }

      const demoUserRecord = {
        _id: `demo-user-${Date.now()}`,
        name: normalizedPayload.name,
        email: normalizedPayload.email,
        phone: normalizedPayload.phone,
        address: normalizeAddress(normalizedPayload.address),
        password: normalizedPayload.password,
        wishlist: [],
        createdAt: new Date().toISOString()
      };

      setDemoUsers((current) => [...current, demoUserRecord]);
      setToken(`demo-user-token:${demoUserRecord.email}`);
      setStoredUser({
        _id: demoUserRecord._id,
        name: demoUserRecord.name,
        email: demoUserRecord.email,
        phone: demoUserRecord.phone,
        address: normalizeAddress(demoUserRecord.address),
        role: 'user',
        wishlist: [],
        isDemoMode: true
      });

      return {
        _id: demoUserRecord._id,
        name: demoUserRecord.name,
        email: demoUserRecord.email,
        phone: demoUserRecord.phone,
        address: normalizeAddress(demoUserRecord.address),
        role: 'user',
        wishlist: []
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setStoredUser(null);
  };

  const updateProfile = async (payload) => {
    if (!user) {
      throw new Error('Please log in to update your profile.');
    }

    setIsLoading(true);
    const normalizedPayload = {
      name: payload.name?.trim() || user.name,
      phone: payload.phone?.trim() || '',
      address: normalizeAddress(payload.address)
    };

    try {
      if (user.isDemoMode) {
        const nextUser = normalizeUser({
          ...user,
          ...normalizedPayload,
          isDemoMode: true
        });

        setStoredUser(nextUser);

        if (user.role !== 'admin') {
          setDemoUsers((current) =>
            current.map((demoUser) =>
              demoUser.email === user.email
                ? {
                    ...demoUser,
                    name: nextUser.name,
                    phone: nextUser.phone,
                    address: nextUser.address
                  }
                : demoUser
            )
          );
        }

        return nextUser;
      }

      const data = await apiRequest('/auth/profile', {
        method: 'PUT',
        token,
        body: normalizedPayload
      });

      const nextUser = normalizeUser(data.user);
      setStoredUser(nextUser);
      return nextUser;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!productId) {
      return;
    }

    if (!token) {
      setGuestWishlist((current) =>
        current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
      );
      return;
    }

    const response = await apiRequest('/auth/wishlist', {
      method: 'POST',
      token,
      body: { productId }
    });

    setStoredUser((current) =>
      current
        ? {
            ...current,
            wishlist: normalizeWishlist(response.wishlist)
          }
        : current
    );
  };

  const wishlistIds = token ? user?.wishlist || [] : guestWishlist;

  const value = useMemo(
    () => ({
      token,
      user,
      demoUsers: demoUsers.map((demoUser) => ({
        _id: demoUser._id,
        name: demoUser.name,
        email: demoUser.email,
        phone: demoUser.phone || '',
        address: normalizeAddress(demoUser.address),
        role: 'user',
        createdAt: demoUser.createdAt || null
      })),
      isLoading,
      wishlistIds,
      isAdmin: user?.role === 'admin',
      login,
      signup,
      updateProfile,
      logout,
      refreshProfile,
      toggleWishlist
    }),
    [token, user, demoUsers, isLoading, wishlistIds]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
};
