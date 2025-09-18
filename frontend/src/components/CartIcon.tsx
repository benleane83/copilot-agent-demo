import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link 
      to="/cart" 
      className="relative p-2 text-light hover:text-primary transition-colors"
      aria-label={`Cart with ${totalItems} items`}
    >
      <svg 
        className="w-6 h-6" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-3L3 3m4 10v6a1 1 0 001 1h8a1 1 0 001-1v-6m-7 3h2"></path>
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}