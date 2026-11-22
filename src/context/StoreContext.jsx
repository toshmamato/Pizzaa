
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [themeReady, setThemeReady] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [favorites, setFavorites] = useState([]);
  const [favoritesReady, setFavoritesReady] = useState(false);

  // Theme settings
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("turbo_theme");

      if (savedTheme !== null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDarkMode(savedTheme === "dark");
      }
    } catch {
      setDarkMode(true);
    } finally {
      setThemeReady(true);
    }
  }, []);

  useEffect(() => {
    if (!themeReady) return;

    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("light", !darkMode);
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";

    try {
      localStorage.setItem("turbo_theme", darkMode ? "dark" : "light");
    } catch {}
  }, [darkMode, themeReady]);

  // Favorites
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("turbo_favorites") || "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFavorites(Array.isArray(saved) ? saved.map(String) : []);
    } catch {
      setFavorites([]);
    } finally {
      setFavoritesReady(true);
    }
  }, []);

  useEffect(() => {
    if (favoritesReady) {
      localStorage.setItem("turbo_favorites", JSON.stringify(favorites));
    }
  }, [favorites, favoritesReady]);

  const toggleFavorite = (productId) => {
    const id = String(productId);

    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const isFavorite = (productId) =>
    favorites.includes(String(productId));

  // Authentication
  useEffect(() => {
    const savedToken = localStorage.getItem("turbo_token");

    if (!savedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Session expired");
        return res.json();
      })
      .then((data) => {
        setToken(savedToken);
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("turbo_token");
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const login = (data) => {
    localStorage.setItem("turbo_token", data.token);
    setToken(data.token);
    setUser(data.user);
    setIsAuthOpen(false);
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } finally {
      localStorage.removeItem("turbo_token");
      setToken(null);
      setUser(null);
    }
  };

  // Cart
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,

        darkMode,
        setDarkMode,

        isCartOpen,
        setIsCartOpen,

        isAuthOpen,
        setIsAuthOpen,

        user,
        token,
        login,
        logout,
        authLoading,

        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);


