import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartState, Product, CartContextType, CouponCode } from '../types/cart';

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'octocat-cart';
const SHIPPING_RATE = 15.00; // Fixed shipping rate
const VALID_COUPONS: Record<string, CouponCode> = {
  'SAVE10': { code: 'SAVE10', discountType: 'percentage', discountValue: 10, isValid: true },
  'SAVE25': { code: 'SAVE25', discountType: 'fixed', discountValue: 25, isValid: true },
  'FREESHIP': { code: 'FREESHIP', discountType: 'fixed', discountValue: 15, isValid: true },
};

const initialCartState: CartState = {
  items: [],
  subtotal: 0,
  discount: 0,
  shipping: 0,
  total: 0,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(initialCartState);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart.cart || initialCartState);
        setAppliedCoupon(parsedCart.appliedCoupon || null);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, appliedCoupon }));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart, appliedCoupon]);

  // Calculate cart totals whenever items or coupon changes
  useEffect(() => {
    const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = subtotal * (appliedCoupon.discountValue / 100);
      } else {
        discount = appliedCoupon.discountValue;
      }
    }

    const shipping = cart.items.length > 0 ? SHIPPING_RATE : 0;
    const adjustedShipping = appliedCoupon?.code === 'FREESHIP' ? 0 : shipping;
    const total = Math.max(0, subtotal - discount + adjustedShipping);

    setCart(prev => ({
      ...prev,
      subtotal,
      discount,
      shipping: adjustedShipping,
      total,
    }));
  }, [cart.items, appliedCoupon]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existingItemIndex = prev.items.findIndex(item => item.product.productId === product.productId);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...prev.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return { ...prev, items: updatedItems };
      } else {
        // Add new item
        return {
          ...prev,
          items: [...prev.items, { product, quantity }],
        };
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.product.productId !== productId),
    }));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.product.productId === productId
          ? { ...item, quantity }
          : item
      ),
    }));
  };

  const clearCart = () => {
    setCart(initialCartState);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): boolean => {
    const coupon = VALID_COUPONS[code.toUpperCase()];
    if (coupon && coupon.isValid) {
      setAppliedCoupon(coupon);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getItemCount = (): number => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      getItemCount,
      appliedCoupon,
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