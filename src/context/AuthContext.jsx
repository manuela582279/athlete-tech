import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "athlete-tech-auth";
const ACCOUNTS_KEY = "athlete-tech-accounts";

const AuthContext = createContext(null);

const readAccounts = () => {
  try {
    return JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveAccounts = (accounts) => {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

const sanitizeUser = (account) => {
  const { password, ...safe } = account;
  return safe;
};

const makeAthleteId = (email) => {
  return (
    (`${email}`.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      8) +
    1
  );
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const userData = JSON.parse(saved);
        setUser(userData);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password, profile = null) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const accounts = readAccounts();
        let account = accounts.find(
          (a) => a.email.toLowerCase() === email.toLowerCase(),
        );

        if (profile) {
          account = {
            email,
            password,
            name: profile.name || email.split("@")[0],
            role: profile.role || "professional",
            athleteId: profile.athleteId || makeAthleteId(email),
            sport: profile.sport || null,
            age: profile.age || null,
            gender: profile.gender || null,
            organization: profile.organization || null,
            team: profile.team || null,
            position: profile.position || null,
            number: profile.number || null,
            specialty: profile.specialty || null,
            createdAt: new Date().toISOString(),
          };

          const nextAccounts = accounts.filter(
            (a) => a.email.toLowerCase() !== email.toLowerCase(),
          );
          nextAccounts.push(account);
          saveAccounts(nextAccounts);
        } else if (!account) {
          account = {
            email,
            password,
            name: email.split("@")[0],
            role: "professional",
            athleteId: makeAthleteId(email),
            gender: null,
            specialty: null,
            createdAt: new Date().toISOString(),
          };
          saveAccounts([...accounts, account]);
        }

        const userData = sanitizeUser(account);
        setUser(userData);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        resolve(userData);
      }, 600);
    });
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
