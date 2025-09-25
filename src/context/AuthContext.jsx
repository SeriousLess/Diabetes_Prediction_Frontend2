import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (storedToken && username) {
      setUser({ username });
      setToken(storedToken);
    }
  }, []);

  const login = (newToken, username) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", username);
    setUser({ username });
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 👇 Hook personalizado para usar el contexto más fácil
export const useAuth = () => useContext(AuthContext);
