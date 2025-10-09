import { useState } from 'react';
import { useCart } from '../../context/CartContext';

interface AddToCartButtonProps {
  productId: number;
  quantity: number;
  disabled?: boolean;
  className?: string;
  onSuccess?: () => void;
}

export default function AddToCartButton({ 
  productId, 
  quantity, 
  disabled = false, 
  className = '',
  onSuccess 
}: AddToCartButtonProps) {
  const { addItem, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddToCart = async () => {
    if (quantity <= 0) return;
    
    try {
      setIsAdding(true);
      setMessage('');
      await addItem(productId, quantity);
      setMessage('Added to cart!');
      onSuccess?.();
      
      // Clear success message after 2 seconds
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Failed to add to cart');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsAdding(false);
    }
  };

  const isDisabled = disabled || quantity <= 0 || isAdding || loading;

  return (
    <div className="relative">
      <button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={`px-4 py-2 rounded-lg transition-colors font-medium ${
          isDisabled
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-primary hover:bg-accent text-white'
        } ${className}`}
      >
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>
      
      {message && (
        <div className={`absolute top-full left-0 right-0 mt-1 text-sm text-center ${
          message.includes('Failed') ? 'text-red-400' : 'text-green-400'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}