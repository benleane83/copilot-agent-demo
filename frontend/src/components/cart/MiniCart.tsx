import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export default function MiniCart() {
  const { cart } = useCart();

  return (
    <Link 
      to="/cart" 
      className="relative flex items-center text-light hover:text-primary transition-colors"
      aria-label={`Shopping cart with ${cart.itemCount} items`}
    >
      {/* Shopping cart icon */}
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19m-6 0a1 1 0 11-2 0m2 0a1 1 0 11-2 0" 
        />
      </svg>
      
      {/* Item count badge */}
      {cart.itemCount > 0 && (
        <span 
          className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          aria-hidden="true"
        >
          {cart.itemCount > 99 ? '99+' : cart.itemCount}
        </span>
      )}
      
      {/* Screen reader text */}
      <span className="sr-only">
        Shopping cart with {cart.itemCount} items
      </span>
    </Link>
  );
}