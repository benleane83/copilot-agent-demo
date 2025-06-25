import { CartItem as CartItemType, useCart } from '../../../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 0) {
      updateQuantity(item.productId, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
      <div className="flex-shrink-0 w-16 h-16">
        <img
          src={`/product-images/${item.productImage}`}
          alt={item.productName}
          className="w-full h-full object-cover rounded-md"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/product-images/placeholder.png';
          }}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-light font-medium truncate">{item.productName}</h3>
        <p className="text-gray-400 text-sm">${item.productPrice.toFixed(2)} each</p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(-1)}
          className="w-8 h-8 flex items-center justify-center text-light hover:text-primary transition-colors border border-gray-600 rounded"
          aria-label={`Decrease quantity of ${item.productName}`}
        >
          <span aria-hidden="true">−</span>
        </button>
        
        <span 
          className="text-light min-w-[2rem] text-center font-medium"
          aria-label={`Quantity: ${item.quantity}`}
        >
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(1)}
          className="w-8 h-8 flex items-center justify-center text-light hover:text-primary transition-colors border border-gray-600 rounded"
          aria-label={`Increase quantity of ${item.productName}`}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      <div className="text-light font-medium min-w-[4rem] text-right">
        ${(item.productPrice * item.quantity).toFixed(2)}
      </div>

      <button
        onClick={handleRemove}
        className="text-red-400 hover:text-red-300 transition-colors p-1"
        aria-label={`Remove ${item.productName} from cart`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}