import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <svg 
              className="mx-auto h-24 w-24 text-gray-400 mb-4" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-3L5 20H19" />
            </svg>
            <h1 className="text-3xl font-bold text-light mb-4">Your cart is empty</h1>
            <p className="text-gray-400 mb-8">Start shopping to add items to your cart</p>
            <Link 
              to="/products" 
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg transition-colors"
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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-light">Shopping Cart</h1>
            <button 
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 px-4 py-2 rounded-lg transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-light font-medium">Product</th>
                    <th className="px-6 py-4 text-left text-light font-medium">Price</th>
                    <th className="px-6 py-4 text-left text-light font-medium">Quantity</th>
                    <th className="px-6 py-4 text-left text-light font-medium">Total</th>
                    <th className="px-6 py-4 text-left text-light font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {items.map((item) => (
                    <tr key={item.productId} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={`/${item.imgName}`} 
                            alt={item.name}
                            className="h-16 w-16 object-contain bg-gray-700 rounded-lg p-2"
                          />
                          <div>
                            <h3 className="text-light font-medium">{item.name}</h3>
                            <p className="text-gray-400 text-sm">{item.description}</p>
                            <p className="text-gray-500 text-xs">SKU: {item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-light">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-light hover:text-primary transition-colors bg-gray-700 rounded"
                          >
                            -
                          </button>
                          <span className="text-light min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-light hover:text-primary transition-colors bg-gray-700 rounded"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-light font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-400 hover:text-red-300 px-3 py-1 rounded transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-400">Total Items: <span className="text-light">{totalItems}</span></p>
                <p className="text-xl font-bold text-light">Total: ${totalPrice.toFixed(2)}</p>
              </div>
              <div className="space-x-4">
                <Link 
                  to="/products" 
                  className="bg-gray-700 hover:bg-gray-600 text-light px-6 py-3 rounded-lg transition-colors"
                >
                  Continue Shopping
                </Link>
                <button 
                  className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg transition-colors"
                  onClick={() => alert('Checkout functionality would be implemented here')}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}