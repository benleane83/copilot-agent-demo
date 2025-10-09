import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
  sku: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: { productId: number; name: string; price: number; imgName: string; sku: string }, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  applyCoupon: (code: string) => boolean;
  discount: number;
  couponCode: string | null;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'octocat-cart';
const COUPON_STORAGE_KEY = 'octocat-coupon';

// Simple coupon system
const VALID_COUPONS: Record<string, number> = {
  'SAVE10': 0.1,
  'SAVE20': 0.2,
  'WELCOME': 0.15,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
    
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    
    if (savedCoupon) {
      try {
        const couponData = JSON.parse(savedCoupon);
        setCouponCode(couponData.code);
        setDiscount(couponData.discount);
      } catch (error) {
        console.error('Error loading coupon from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Save coupon to localStorage whenever it changes
  useEffect(() => {
    if (couponCode && discount > 0) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify({ code: couponCode, discount }));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [couponCode, discount]);

  const addToCart = (product: { productId: number; name: string; price: number; imgName: string; sku: string }, quantity: number) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.productId === product.productId);
      
      if (existingItem) {
        return prev.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, {
          ...product,
          quantity
        }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscount(0);
    setCouponCode(null);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return subtotal * (1 - discount);
  };

  const applyCoupon = (code: string): boolean => {
    const upperCode = code.toUpperCase();
    if (VALID_COUPONS[upperCode]) {
      setCouponCode(upperCode);
      setDiscount(VALID_COUPONS[upperCode]);
      return true;
    }
    return false;
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      applyCoupon,
      discount,
      couponCode
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