import { useCart, CartItem as CartItemType } from '../../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      removeFromCart(item.productId);
    } else {
      updateQuantity(item.productId, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={`/images/${item.imgName}`}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder.png';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <h3 className="text-light font-medium">{item.name}</h3>
        <p className="text-gray-400 text-sm">SKU: {item.sku}</p>
        <p className="text-primary font-semibold">${item.price.toFixed(2)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => handleQuantityChange(-1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-light rounded transition-colors"
          aria-label={`Decrease quantity of ${item.name}`}
        >
          <span aria-hidden="true">-</span>
        </button>
        
        <span className="text-light min-w-[2rem] text-center">
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-light rounded transition-colors"
          aria-label={`Increase quantity of ${item.name}`}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      {/* Item Total & Remove */}
      <div className="flex flex-col items-end space-y-2">
        <span className="text-light font-semibold">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        <button
          onClick={() => removeFromCart(item.productId)}
          className="text-red-400 hover:text-red-300 text-sm transition-colors"
          aria-label={`Remove ${item.name} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  );
}