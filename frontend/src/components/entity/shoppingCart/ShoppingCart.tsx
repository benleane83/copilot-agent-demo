import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { api } from '../../../api/config';
import { useCart } from '../../../context/CartContext';

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
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.products}`);
  return data;
};

export default function ShoppingCart() {
  const navigate = useNavigate();
  const { cart, isLoading: cartLoading, updateQuantity, removeFromCart, emptyCart } = useCart();
  const { data: products, isLoading: productsLoading } = useQuery('products', fetchProducts);

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleEmptyCart = async () => {
    if (window.confirm('Are you sure you want to empty your cart?')) {
      try {
        await emptyCart();
      } catch (error) {
        console.error('Failed to empty cart:', error);
      }
    }
  };

  const handleCheckout = () => {
    if (cart && cart.items.length > 0) {
      alert('Checkout functionality will be integrated with the existing order system');
      // In a real implementation, this would create an order from the cart
    }
  };

  const getProductDetails = (productId: number) => {
    return products?.find(p => p.productId === productId);
  };

  if (cartLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-dark pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
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
            {cart && cart.items.length > 0 && (
              <button
                onClick={handleEmptyCart}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Empty Cart
              </button>
            )}
          </div>

          {!cart || cart.items.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400 text-xl mb-4">Your cart is empty</p>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 bg-primary hover:bg-accent text-white rounded-lg transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.items.map((item) => {
                  const product = getProductDetails(item.productId);
                  if (!product) return null;

                  return (
                    <div key={item.productId} className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4">
                      <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={`/${product.imgName}`}
                          alt={product.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-light">{product.name}</h3>
                        <p className="text-gray-400 text-sm">{product.description}</p>
                        <p className="text-primary font-bold mt-1">${item.price.toFixed(2)} each</p>
                      </div>

                      <div className="flex items-center space-x-3 bg-gray-700 rounded-lg p-1">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-light hover:text-primary transition-colors"
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          -
                        </button>
                        <span className="text-light min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-light hover:text-primary transition-colors"
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <p className="text-xl font-bold text-light">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl text-light">Total Items:</span>
                  <span className="text-xl text-light font-semibold">
                    {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-6 text-2xl">
                  <span className="text-light font-bold">Total Amount:</span>
                  <span className="text-primary font-bold">${cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate('/products')}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="flex-1 px-6 py-3 bg-primary hover:bg-accent text-white rounded-lg transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
