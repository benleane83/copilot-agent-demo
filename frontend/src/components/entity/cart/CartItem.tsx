import { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { CartItem as CartItemType } from '../../../types/cart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    // Add a small delay to show loading state
    setTimeout(() => {
      updateQuantity(item.product.productId, newQuantity);
      setIsUpdating(false);
    }, 300);
  };

  const handleRemove = () => {
    if (confirm(`Remove ${item.product.name} from cart?`)) {
      removeFromCart(item.product.productId);
    }
  };

  const itemTotal = item.product.price * item.quantity;

  return (
    <div className="p-4">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex items-start space-x-4">
          <img 
            src={`/products/${item.product.imgName}`}
            alt={item.product.name}
            className="w-20 h-20 object-cover rounded-lg bg-gray-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.png';
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-light font-medium text-lg mb-1">{item.product.name}</h3>
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.product.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="text-primary font-bold text-lg">
                ${item.product.price.toFixed(2)}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-light rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center bg-gray-700 text-light rounded px-2 py-1 text-sm"
                  min="1"
                  disabled={isUpdating}
                />
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating}
                  className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-light rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="text-light font-bold">
                Total: ${itemTotal.toFixed(2)}
              </div>
              <button
                onClick={handleRemove}
                className="text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
        {/* Product Info */}
        <div className="col-span-6 flex items-center space-x-4">
          <img 
            src={`/products/${item.product.imgName}`}
            alt={item.product.name}
            className="w-16 h-16 object-cover rounded-lg bg-gray-700 flex-shrink-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.png';
            }}
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-light font-medium text-lg mb-1">{item.product.name}</h3>
            <p className="text-gray-400 text-sm line-clamp-2">{item.product.description}</p>
            <button
              onClick={handleRemove}
              className="text-red-400 hover:text-red-300 text-sm mt-2 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="col-span-2 text-center">
          <div className="text-primary font-bold text-lg">
            ${item.product.price.toFixed(2)}
          </div>
        </div>

        {/* Quantity */}
        <div className="col-span-2 flex items-center justify-center space-x-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-light rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-16 text-center bg-gray-700 text-light rounded px-2 py-1"
            min="1"
            disabled={isUpdating}
          />
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating}
            className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-light rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>

        {/* Total */}
        <div className="col-span-2 text-center">
          <div className="text-light font-bold text-lg">
            ${itemTotal.toFixed(2)}
          </div>
        </div>
      </div>

      {isUpdating && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="text-light">Updating...</div>
        </div>
      )}
    </div>
  );
}