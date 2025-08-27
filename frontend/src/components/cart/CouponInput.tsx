import { useState } from 'react';
import { useCart } from '../../context/CartContext';

export default function CouponInput() {
  const { applyCoupon, couponCode, discount } = useCart();
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleApplyCoupon = () => {
    if (!inputValue.trim()) {
      setMessage('Please enter a coupon code');
      setMessageType('error');
      return;
    }

    const success = applyCoupon(inputValue.trim());
    
    if (success) {
      setMessage(`Coupon applied! ${(discount * 100).toFixed(0)}% off`);
      setMessageType('success');
      setInputValue('');
    } else {
      setMessage('Invalid coupon code');
      setMessageType('error');
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor="coupon-code" className="block text-sm font-medium text-gray-300 mb-2">
        Coupon Code
      </label>
      
      {couponCode ? (
        <div className="bg-green-900/50 border border-green-600 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-green-400 font-medium">
              {couponCode} Applied ({(discount * 100).toFixed(0)}% off)
            </span>
            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              id="coupon-code"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter coupon code"
              className="flex-1 bg-gray-700 border border-gray-600 text-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleApplyCoupon}
              className="bg-gray-600 hover:bg-gray-500 text-light px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Apply
            </button>
          </div>
          
          {message && (
            <div className={`text-sm ${messageType === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            Try: SAVE10, SAVE20, or WELCOME
          </div>
        </div>
      )}
    </div>
  );
}