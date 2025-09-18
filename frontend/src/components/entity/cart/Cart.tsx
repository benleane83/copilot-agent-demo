import { useCart } from '../../../context/CartContext';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';

export default function Cart() {
  const { cart, getItemCount } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-dark">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-light mb-8">Shopping Cart</h1>
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-light mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <a 
              href="/products" 
              className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-lg transition-colors inline-block"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-light">Shopping Cart</h1>
          <div className="text-gray-400">
            {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {/* Desktop Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-700 text-gray-300 text-sm font-medium">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-700">
                {cart.items.map((item) => (
                  <CartItem key={item.product.productId} item={item} />
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <a 
                href="/products" 
                className="text-primary hover:text-accent transition-colors inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Continue Shopping
              </a>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}