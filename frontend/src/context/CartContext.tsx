import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Coupon, CartSummary } from '../types/cart';

interface CartContextType {
  items: CartItem[];
  coupon: Coupon | null;
  addToCart: (productId: number, name: string, price: number, imgName: string, sku: string, unit: string, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getCartSummary: () => CartSummary;
  getTotalItems: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'octoCatCart';
const COUPON_STORAGE_KEY = 'octoCatCoupon';

// Simple coupon codes for demo purposes
const AVAILABLE_COUPONS: Record<string, number> = {
  'SAVE10': 10,
  'SAVE20': 20,
  'WELCOME': 15,
  'DISCOUNT25': 25,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      
      if (savedCoupon) {
        setCoupon(JSON.parse(savedCoupon));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  // Save coupon to localStorage whenever it changes
  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving coupon to localStorage:', error);
    }
  }, [coupon]);

  const addToCart = (productId: number, name: string, price: number, imgName: string, sku: string, unit: string, quantity: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === productId);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { productId, name, price, imgName, sku, unit, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const applyCoupon = (code: string): boolean => {
    const upperCode = code.toUpperCase();
    const discountPercentage = AVAILABLE_COUPONS[upperCode];
    
    if (discountPercentage) {
      setCoupon({
        code: upperCode,
        discountPercentage,
        isApplied: true,
      });
      return true;
    }
    
    return false;
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const getCartSummary = (): CartSummary => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = coupon ? (subtotal * coupon.discountPercentage) / 100 : 0;
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const grandTotal = subtotal - discount + shipping;

    return {
      subtotal,
      discount,
      shipping,
      grandTotal,
    };
  };

  const getTotalItems = (): number => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  return (
    <CartContext.Provider value={{
      items,
      coupon,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyCoupon,
      removeCoupon,
      getCartSummary,
      getTotalItems,
      clearCart,
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