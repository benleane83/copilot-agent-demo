import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, coupon, removeFromCart, updateQuantity, applyCoupon, removeCoupon, getCartSummary, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const summary = getCartSummary();

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const success = applyCoupon(couponCode.trim());
    if (success) {
      setCouponCode('');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try: SAVE10, SAVE20, WELCOME, or DISCOUNT25');
    }
  };

  const handleCheckout = () => {
    setShowCheckout(true);
    // In a real app, this would integrate with a payment system
    setTimeout(() => {
      clearCart();
      setShowCheckout(false);
      alert('Order placed successfully! Thank you for your purchase.');
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-light mb-8">Shopping Cart</h1>
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-light mb-2">Your cart is empty</h3>
            <p className="text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link 
              to="/products" 
              className="inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-light">Shopping Cart</h1>
          <Link to="/products" className="text-primary hover:text-accent transition-colors">
            ← Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {items.map((item) => (
                <div key={item.productId} className="p-6 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={`/${item.imgName}`} 
                      alt={item.name}
                      className="w-20 h-20 object-contain bg-gray-700 rounded-lg p-2"
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-light">{item.name}</h3>
                      <p className="text-gray-400 text-sm">SKU: {item.sku}</p>
                      <p className="text-primary font-bold">${item.price.toFixed(2)} per {item.unit}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-light hover:text-primary transition-colors"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span className="text-light min-w-[2rem] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-light hover:text-primary transition-colors"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-light font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-light mb-6">Order Summary</h2>
              
              {/* Coupon Section */}
              <div className="mb-6">
                {!coupon ? (
                  <div>
                    <label htmlFor="coupon" className="block text-sm font-medium text-light mb-2">
                      Coupon Code
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        id="coupon"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponError('');
                        }}
                        placeholder="Enter coupon code"
                        className="flex-grow px-3 py-2 bg-gray-700 text-light rounded border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-primary hover:bg-accent text-white px-4 py-2 rounded transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-400 text-sm mt-1">{couponError}</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-400 font-medium">Coupon Applied</p>
                        <p className="text-light text-sm">{coupon.code} (-{coupon.discountPercentage}%)</p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        aria-label="Remove coupon"
                      >
                        <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-light">
                  <span>Subtotal</span>
                  <span>${summary.subtotal.toFixed(2)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-${summary.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-light">
                  <span>Shipping</span>
                  <span>{summary.shipping === 0 ? 'Free' : `$${summary.shipping.toFixed(2)}`}</span>
                </div>
                {summary.subtotal < 100 && (
                  <p className="text-gray-400 text-sm">Free shipping on orders over $100</p>
                )}
                <hr className="border-gray-700" />
                <div className="flex justify-between text-xl font-bold text-light">
                  <span>Total</span>
                  <span>${summary.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={showCheckout}
                className="w-full bg-primary hover:bg-accent disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {showCheckout ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              {/* Available Coupons Hint */}
              <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Available coupons:</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>SAVE10 - 10% off</div>
                  <div>SAVE20 - 20% off</div>
                  <div>WELCOME - 15% off</div>
                  <div>DISCOUNT25 - 25% off</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}