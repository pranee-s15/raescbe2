import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useLocalStorage('raes-cart', []);
  const [pendingCheckout, setPendingCheckout] = useLocalStorage('raes-pending-checkout', []);
  const [lastOrder, setLastOrder] = useLocalStorage('raes-last-order', null);
  const [orderHistory, setOrderHistory] = useLocalStorage('raes-order-history', []);

  const addToCart = (product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item._id === product._id);

      if (existing) {
        return current.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...current, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item._id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart((current) =>
      current.map((item) => (item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  };

  const clearCart = () => setCart([]);

  const startBuyNow = (product, quantity = 1) => {
    setPendingCheckout([{ ...product, quantity }]);
  };

  const clearPendingCheckout = () => setPendingCheckout([]);

  const addOrder = (order) => {
    setLastOrder(order);
    setOrderHistory((current) => [order, ...current.filter((item) => item._id !== order._id)]);
  };

  const updateOrder = (orderId, updates) => {
    setOrderHistory((current) =>
      current.map((order) => (order._id === orderId ? { ...order, ...updates } : order))
    );
    setLastOrder((current) => (current?._id === orderId ? { ...current, ...updates } : current));
  };

  const value = useMemo(
    () => ({
      cart,
      pendingCheckout,
      lastOrder,
      orderHistory,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      startBuyNow,
      clearPendingCheckout,
      setLastOrder,
      addOrder,
      updateOrder
    }),
    [cart, pendingCheckout, lastOrder, orderHistory]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error('useShop must be used within ShopProvider.');
  }

  return context;
};
