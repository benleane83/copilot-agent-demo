import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useQuery } from 'react-query';

interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('http://localhost:3000/api/products');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem, checkout } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  
  const { data: products } = useQuery('products', fetchProducts);

  const getProductDetails = (productId: number) => {
    return products?.find(p => p.productId === productId);
  };

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const result = await checkout();
      setCheckoutMessage(`Order #${result.orderId} created successfully!`);
    } catch (error) {
      setCheckoutMessage('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading && cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-dark pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-light mt-4">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-light mb-8">Shopping Cart</h1>
        
        {checkoutMessage && (
          <div className={`p-4 rounded-lg mb-6 ${
            checkoutMessage.includes('successfully') 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {checkoutMessage}
          </div>
        )}

        {cart.items.length === 0 ? (
          <div className="text-center py-12">
            <svg 
              className="mx-auto h-24 w-24 text-gray-400 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19" 
              />
            </svg>
            <h2 className="text-xl font-medium text-light mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Start shopping to add items to your cart.</p>
            <a 
              href="/products" 
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg transition-colors"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.items.map((item) => {
                  const product = getProductDetails(item.productId);
                  return (
                    <div 
                      key={item.productId} 
                      className="bg-gray-800 rounded-lg p-6 flex items-center space-x-4"
                    >
                      {product && (
                        <img 
                          src={`/products/${product.imgName}`} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium text-light">
                          {product?.name || `Product ${item.productId}`}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          ${item.unitPrice.toFixed(2)} each
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-light rounded"
                          disabled={loading}
                        >
                          -
                        </button>
                        <span className="text-light font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-light rounded"
                          disabled={loading}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-medium text-light">
                          ${item.subtotal.toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-red-400 hover:text-red-300 text-sm"
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-medium text-light mb-4">Order Summary</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-400">
                    <span>Items ({cart.itemCount})</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2">
                    <div className="flex justify-between text-lg font-medium text-light">
                      <span>Total</span>
                      <span>${cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || loading || cart.items.length === 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isCheckingOut || loading || cart.items.length === 0
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-accent text-white'
                  }`}
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}