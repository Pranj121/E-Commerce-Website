import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load logged-in user on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("bookbazaar_logged_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Signup (store user)
  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem("bookbazaar_users")) || [];

    const exists = users.find((u) => u.email === email);
    if (exists) {
      throw new Error("User already exists");
    }

    const newUser = { name, email, password };
    users.push(newUser);

    localStorage.setItem("bookbazaar_users", JSON.stringify(users));
  };

  // Login
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("bookbazaar_users")) || [];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error("User not found");
    }

    localStorage.setItem(
      "bookbazaar_logged_user",
      JSON.stringify(foundUser)
    );
    setUser(foundUser);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("bookbazaar_logged_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
