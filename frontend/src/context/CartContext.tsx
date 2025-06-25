import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

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
  const [couponCode, setCouponCode] = useState<string | undefined>();
  const [discount, setDiscount] = useState(0);

  // Sample coupon codes for demo
  const coupons = [
    { code: 'SAVE10', type: 'percentage', value: 10, minOrder: 50, description: '10% off orders over $50' },
    { code: 'WELCOME5', type: 'fixed', value: 5, minOrder: 0, description: '$5 off your order' },
    { code: 'BIGDEAL', type: 'percentage', value: 25, minOrder: 200, description: '25% off orders over $200' }
  ];

  // Clear cart when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      setItems([]);
      setCouponCode(undefined);
      setDiscount(0);
    }
  }, [isLoggedIn]);

  // Calculate totals
  const calculateTotals = (): CartTotals => {
    const subtotal = items.reduce((total, item) => total + (item.productPrice * item.quantity), 0);
    const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0; // Free shipping over $100
    const total = subtotal - discount + shipping;

    return {
      subtotal,
      discount,
      shipping,
      total: Math.max(0, total)
    };
  };

  const addToCart = (productId: number, productName: string, productPrice: number, productImage: string, quantity: number) => {
    if (!isLoggedIn) {
      alert('Please log in to add items to cart');
      return;
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === productId);
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { productId, productName, productPrice, productImage, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const coupon = coupons.find(c => c.code === code);
    if (!coupon) {
      return false;
    }

    const subtotal = calculateTotals().subtotal;
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      alert(`Minimum order value of $${coupon.minOrder} required for this coupon`);
      return false;
    }

    setCouponCode(code);
    if (coupon.type === 'percentage') {
      setDiscount((subtotal * coupon.value) / 100);
    } else {
      setDiscount(coupon.value);
    }

    return true;
  };

  const removeCoupon = () => {
    setCouponCode(undefined);
    setDiscount(0);
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(undefined);
    setDiscount(0);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const totals = calculateTotals();

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