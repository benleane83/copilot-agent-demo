import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { api } from '../api/config';

interface CartItem {
  productId: number;
  quantity: number;
  price: number;
}

interface Cart {
  cartId: string;
  items: CartItem[];
  totalAmount: number;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  emptyCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

// Generate a unique cart ID for the user (in a real app, this would be tied to the user session)
const getCartId = () => {
  let cartId = localStorage.getItem('cartId');
  if (!cartId) {
    cartId = `cart-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('cartId', cartId);
  }
  return cartId;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cartId = getCartId();

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${api.baseURL}${api.endpoints.cart}/${cartId}`);
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  const addToCart = async (productId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${api.baseURL}${api.endpoints.cart}/${cartId}/items`, {
        productId,
        quantity
      });
      setCart(data);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const { data } = await axios.put(`${api.baseURL}${api.endpoints.cart}/${cartId}/items/${productId}`, {
        quantity
      });
      setCart(data);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      setIsLoading(true);
      const { data } = await axios.delete(`${api.baseURL}${api.endpoints.cart}/${cartId}/items/${productId}`);
      setCart(data);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const emptyCart = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.delete(`${api.baseURL}${api.endpoints.cart}/${cartId}`);
      setCart(data);
    } catch (error) {
      console.error('Failed to empty cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ cart, isLoading, addToCart, updateQuantity, removeFromCart, emptyCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
