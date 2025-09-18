import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CouponInput from './CouponInput';

export default function CartPage() {
  const { items, clearCart, getTotalItems } = useCart();

  return (
    <div className="min-h-screen bg-dark pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light mb-2">Shopping Cart</h1>
          <p className="text-gray-400">
            {getTotalItems() === 0 
              ? 'Your cart is empty' 
              : `${getTotalItems()} item${getTotalItems() === 1 ? '' : 's'} in your cart`
            }
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <svg 
                className="mx-auto h-24 w-24 text-gray-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h11M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-light mb-4">Your cart is empty</h3>
            <p className="text-gray-400 mb-8">Add some products to get started!</p>
            <a 
              href="/products" 
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-light">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-light mb-6">Order Summary</h2>
                
                <CouponInput />
                
                <CartSummary />
                
                <button className="w-full bg-primary hover:bg-accent text-white py-3 px-4 rounded-lg font-medium transition-colors mt-6">
                  Proceed to Checkout
                </button>
                
                <a 
                  href="/products" 
                  className="block text-center text-primary hover:text-accent mt-4 text-sm transition-colors"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}