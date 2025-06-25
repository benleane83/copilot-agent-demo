import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../api/config';
import axios from 'axios';

export interface CartItem {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

interface CartContextType {
  items: CartItem[];
  totals: CartTotals;
  couponCode?: string;
  addToCart: (productId: number, productName: string, productPrice: number, productImage: string, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  clearCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState<CartTotals>({ subtotal: 0, discount: 0, shipping: 0, total: 0 });
  const [couponCode, setCouponCode] = useState<string | undefined>();

  // Simple user ID for demo purposes (in a real app, this would come from auth)
  const userId = isLoggedIn ? 'demo-user' : null;

  // Load cart from backend when user logs in
  useEffect(() => {
    if (userId) {
      loadCart();
    } else {
      // Clear cart when user logs out
      setItems([]);
      setTotals({ subtotal: 0, discount: 0, shipping: 0, total: 0 });
      setCouponCode(undefined);
    }
  }, [userId]);

  const loadCart = async () => {
    if (!userId) return;
    
    try {
      const response = await axios.get(`${api.baseURL}${api.endpoints.cart}/${userId}`);
      const cartData = response.data;
      
      // Convert backend format to frontend format
      const frontendItems: CartItem[] = await Promise.all(
        cartData.items.map(async (item: any) => {
          try {
            const productResponse = await axios.get(`${api.baseURL}${api.endpoints.products}/${item.productId}`);
            const product = productResponse.data;
            return {
              productId: item.productId,
              productName: product.name,
              productPrice: product.price,
              productImage: product.imgName,
              quantity: item.quantity
            };
          } catch {
            // If product not found, return a placeholder
            return {
              productId: item.productId,
              productName: 'Unknown Product',
              productPrice: 0,
              productImage: 'placeholder.png',
              quantity: item.quantity
            };
          }
        })
      );
      
      setItems(frontendItems);
      setTotals({
        subtotal: cartData.subtotal || 0,
        discount: cartData.discount || 0,
        shipping: cartData.shipping || 0,
        total: cartData.total || 0
      });
      setCouponCode(cartData.couponCode);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const addToCart = async (productId: number, _productName: string, _productPrice: number, _productImage: string, quantity: number) => {
    if (!isLoggedIn || !userId) {
      alert('Please log in to add items to cart');
      return;
    }

    try {
      await axios.post(`${api.baseURL}${api.endpoints.cart}/${userId}`, {
        productId,
        quantity
      });
      
      // Reload cart to get updated state
      await loadCart();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!userId) return;
    
    try {
      await axios.delete(`${api.baseURL}${api.endpoints.cart}/${userId}?productId=${productId}`);
      await loadCart();
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      alert('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!userId) return;
    
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
      } else {
        await axios.put(`${api.baseURL}${api.endpoints.cart}/${userId}`, {
          productId,
          quantity
        });
        await loadCart();
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      await axios.post(`${api.baseURL}${api.endpoints.cart}/${userId}/coupon`, {
        couponCode: code
      });
      await loadCart();
      return true;
    } catch (error: any) {
      console.error('Failed to apply coupon:', error);
      
      // Extract error message from response if available
      const errorMessage = error.response?.data?.error || 'Failed to apply coupon';
      if (errorMessage.includes('minimum order')) {
        alert(errorMessage);
      }
      
      return false;
    }
  };

  const removeCoupon = async () => {
    if (!userId) return;
    
    try {
      await axios.delete(`${api.baseURL}${api.endpoints.cart}/${userId}/coupon`);
      await loadCart();
    } catch (error) {
      console.error('Failed to remove coupon:', error);
      alert('Failed to remove coupon');
    }
  };

  const clearCart = async () => {
    if (!userId) return;
    
    try {
      // Remove all items one by one (since we don't have a clear endpoint)
      for (const item of items) {
        await removeFromCart(item.productId);
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      alert('Failed to clear cart');
    }
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      totals,
      couponCode,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyCoupon,
      removeCoupon,
      clearCart,
      getItemCount
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