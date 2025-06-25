import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import CartItem from './CartItem';

export default function Cart() {
  const { items, totals, couponCode, applyCoupon, removeCoupon, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-dark text-light pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
            <p className="text-gray-400 mb-6">Please log in to view your cart.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    
    setIsApplyingCoupon(true);
    setCouponError('');
    
    const success = await applyCoupon(couponInput.trim().toUpperCase());
    if (success) {
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code');
    }
    
    setIsApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponError('');
  };

  const handleUpdateCart = () => {
    // For now, just show a success message
    alert('Cart updated successfully!');
  };

  const handleProceedToCheckout = () => {
    // For now, just show a placeholder message
    alert('Checkout functionality coming soon!');
  };

  return (
    <div className="min-h-screen bg-dark text-light pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <svg 
              className="w-16 h-16 text-gray-600 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.88a2 2 0 001.92 2.62h9.52m-12.4-7h11.6" 
              />
            </svg>
            <h2 className="text-xl font-medium text-gray-400 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some products to get started</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </div>
              
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleUpdateCart}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Update Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                {/* Coupon Code Section */}
                <div className="mb-6">
                  <label htmlFor="coupon" className="block text-sm font-medium mb-2">
                    Coupon Code
                  </label>
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-green-900 text-green-100 p-3 rounded-lg">
                      <span className="font-medium">{couponCode}</span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        aria-label="Remove coupon"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        id="coupon"
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="bg-primary hover:bg-accent disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        {isApplyingCoupon ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-red-400 text-sm mt-2">{couponError}</p>
                  )}
                  <div className="mt-2 text-xs text-gray-400">
                    Try: SAVE10, WELCOME5, or BIGDEAL
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount:</span>
                      <span>-${totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {totals.shipping === 0 ? (
                        <span className="text-green-400">Free</span>
                      ) : (
                        `$${totals.shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-3">
                    <span>Total:</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors mt-6"
                >
                  Proceed to Checkout
                </button>
                
                <p className="text-xs text-gray-400 mt-4 text-center">
                  {totals.subtotal < 100 && 'Free shipping on orders over $100'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}