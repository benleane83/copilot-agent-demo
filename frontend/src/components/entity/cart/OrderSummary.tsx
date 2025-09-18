import { useState } from 'react';
import { useCart } from '../../../context/CartContext';

export default function OrderSummary() {
  const { cart, applyCoupon, removeCoupon, appliedCoupon, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    setCouponError('');
    
    // Simulate API call delay
    setTimeout(() => {
      const success = applyCoupon(couponCode.trim());
      if (success) {
        setCouponCode('');
      } else {
        setCouponError('Invalid coupon code');
      }
      setIsApplyingCoupon(false);
    }, 500);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponError('');
  };

  const handleUpdateCart = () => {
    // For now, just show a success message
    alert('Cart updated successfully!');
  };

  const handleCheckout = () => {
    // For now, just show a placeholder message
    alert('Checkout functionality coming soon!');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
      <h2 className="text-2xl font-bold text-light mb-6">Order Summary</h2>
      
      {/* Coupon Section */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Coupon Code
        </label>
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-green-900 bg-opacity-50 border border-green-500 rounded-lg p-3">
            <div>
              <div className="text-green-400 font-medium">{appliedCoupon.code}</div>
              <div className="text-green-300 text-sm">
                {appliedCoupon.discountType === 'percentage' 
                  ? `${appliedCoupon.discountValue}% off`
                  : `$${appliedCoupon.discountValue.toFixed(2)} off`
                }
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 bg-gray-700 text-light rounded-lg px-3 py-2 text-sm"
                disabled={isApplyingCoupon}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon || !couponCode.trim()}
                className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApplyingCoupon ? 'Applying...' : 'Apply'}
              </button>
            </div>
            {couponError && (
              <div className="text-red-400 text-sm">{couponError}</div>
            )}
            <div className="text-gray-400 text-xs">
              Try: SAVE10, SAVE25, or FREESHIP
            </div>
          </div>
        )}
      </div>

      {/* Order Totals */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span>${cart.subtotal.toFixed(2)}</span>
        </div>
        
        {cart.discount > 0 && (
          <div className="flex justify-between text-green-400">
            <span>Discount</span>
            <span>-${cart.discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-gray-300">
          <span>Shipping</span>
          <span>
            {cart.shipping === 0 && cart.items.length > 0 
              ? 'Free' 
              : cart.shipping > 0 
                ? `$${cart.shipping.toFixed(2)}` 
                : '-'
            }
          </span>
        </div>
        
        <hr className="border-gray-600" />
        
        <div className="flex justify-between text-light text-lg font-bold">
          <span>Total</span>
          <span>${cart.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleUpdateCart}
          className="w-full bg-gray-600 hover:bg-gray-500 text-light py-3 rounded-lg transition-colors"
        >
          Update Cart
        </button>
        
        <button
          onClick={handleCheckout}
          className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors"
        >
          Proceed to Checkout
        </button>
        
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear your cart?')) {
              clearCart();
            }
          }}
          className="w-full text-red-400 hover:text-red-300 py-2 text-sm transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* Security Icons */}
      <div className="mt-6 pt-6 border-t border-gray-600">
        <div className="flex items-center justify-center space-x-4 text-gray-400 text-xs">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Trusted</span>
          </div>
        </div>
      </div>
    </div>
  );
}