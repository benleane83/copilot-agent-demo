import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, totalPrice, removeFromCart, updateQuantity } = useCart();
  const [couponCode, setCouponCode] = useState('');

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
  };

  const handleApplyCoupon = () => {
    // Placeholder for coupon functionality
    alert('Coupon functionality is not yet implemented');
  };

  const handleProceedToCheckout = () => {
    // Placeholder for checkout functionality
    alert('Checkout functionality is not yet implemented');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-light mb-8">Shopping Cart</h1>
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-3L3 3m4 10v6a1 1 0 001 1h8a1 1 0 001-1v-6m-7 3h2"></path>
            </svg>
            <h2 className="text-xl font-semibold text-light mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add some products to your cart to see them here.</p>
            <Link 
              to="/products" 
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-light mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-light font-semibold">Product</th>
                      <th className="px-4 py-3 text-left text-light font-semibold">Price</th>
                      <th className="px-4 py-3 text-left text-light font-semibold">Quantity</th>
                      <th className="px-4 py-3 text-left text-light font-semibold">Total</th>
                      <th className="px-4 py-3 text-left text-light font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.productId} className="border-b border-gray-700">
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={`/${item.imgName}`} 
                              alt={item.name}
                              className="w-16 h-16 object-contain bg-gray-700 rounded"
                            />
                            <div>
                              <h3 className="text-light font-medium">{item.name}</h3>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-light">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-light rounded transition-colors"
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              -
                            </button>
                            <span className="text-light w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-light rounded transition-colors"
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-light font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-4 py-4">
                          <button 
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-light">Order Summary</h2>
              
              {/* Coupon Section */}
              <div className="space-y-3">
                <label htmlFor="coupon" className="block text-light font-medium">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 bg-gray-700 text-light rounded border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-light rounded border border-gray-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-700 pt-4">
                <div className="flex justify-between text-light">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-light">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-light">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-light text-lg font-semibold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors"
              >
                Proceed To Checkout
              </button>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="block w-full text-center bg-gray-700 hover:bg-gray-600 text-light py-3 rounded-lg font-medium transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}