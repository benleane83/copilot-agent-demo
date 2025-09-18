import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api } from '../api/config';

export interface CartItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
  itemCount: number;
}

interface CartContextType {
  cart: Cart;
  loading: boolean;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  checkout: () => Promise<{ orderId: number; message: string }>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    total: 0,
    itemCount: 0
  });
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api.baseURL}${api.endpoints.cart}`);
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: number, quantity: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${api.baseURL}${api.endpoints.cart}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
      
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${api.baseURL}${api.endpoints.cart}/items/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      } else {
        throw new Error('Failed to update item quantity');
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${api.baseURL}${api.endpoints.cart}/items/${productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      } else {
        throw new Error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api.baseURL}${api.endpoints.cart}/checkout`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const result = await response.json();
        // Refresh cart after checkout (should be empty)
        await refreshCart();
        return result;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to checkout');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load cart on mount
  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addItem,
      updateQuantity,
      removeItem,
      checkout,
      refreshCart
    }}>
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