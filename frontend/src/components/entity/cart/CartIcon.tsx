import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

export default function CartIcon() {
  const { getItemCount } = useCart();
  const { isLoggedIn } = useAuth();
  const itemCount = getItemCount();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Link to="/cart" className="relative text-light hover:text-primary transition-colors">
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
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.88a2 2 0 001.92 2.62h9.52m-12.4-7h11.6" 
        />
      </svg>
      {itemCount > 0 && (
        <span 
          className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          aria-label={`${itemCount} items in cart`}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
      <span className="sr-only">Shopping cart</span>
    </Link>
  );
}