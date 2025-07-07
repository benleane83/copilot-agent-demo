import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link 
      to="/cart" 
      className="relative text-light hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
    >
      <svg 
        className="h-6 w-6" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-3L5 20H19" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-xs rounded-full flex items-center justify-center min-w-[1.25rem]">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}