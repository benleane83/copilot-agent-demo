# Shopping Cart Feature Specification

## Overview
This document specifies the implementation of a session-based shopping cart feature for the OctoCAT Supply Chain Management application.

## Requirements

### Functional Requirements
1. **Cart State Management**
   - Cart data stored in-memory (session-based)
   - No persistence required (cart clears on page refresh)
   - Available to all users (no authentication required)
   - Cart state accessible throughout the application

2. **Cart Operations**
   - Add product to cart with specified quantity
   - Update product quantity in cart
   - Remove product from cart
   - Clear entire cart
   - Calculate cart totals (subtotal, item count)

3. **User Interface**
   - **Navigation Bar**
     - Cart icon with badge showing total item count
     - Badge hidden when cart is empty
     - Clicking icon navigates to cart page
   
   - **Cart Page**
     - List of cart items with:
       - Product image
       - Product name
       - Unit price
       - Quantity controls (decrease/increase)
       - Subtotal per item
       - Remove button
     - Cart summary:
       - Total items count
       - Cart subtotal
     - Empty cart message when no items
     - Continue shopping link/button
   
   - **Products Page**
     - "Add to Cart" button integration
     - Quantity selector before adding to cart
     - Visual feedback on successful add

### Non-Functional Requirements
1. **Performance**
   - Cart operations should be instant (in-memory)
   - No API calls required for cart operations

2. **Usability**
   - Clear visual feedback for all cart operations
   - Intuitive quantity controls
   - Responsive design for all screen sizes

3. **Accessibility**
   - Proper ARIA labels for cart controls
   - Keyboard navigation support
   - Screen reader friendly

## Technical Design

### Architecture
- **Cart Context** (`frontend/src/context/CartContext.tsx`)
  - React Context for global cart state
  - Provides cart items array and operations
  - Wraps entire application in App.tsx

### Data Model
```typescript
interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
  unit: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}
```

### Components

1. **CartContext.tsx**
   - Provides cart state and operations
   - Calculates derived values (itemCount, subtotal)
   - Manages cart items array

2. **Cart.tsx** (new)
   - Full cart page component
   - Displays all cart items
   - Cart summary section
   - Route: `/cart`

3. **Navigation.tsx** (modified)
   - Add cart icon with badge
   - Display item count from CartContext
   - Link to cart page

4. **Products.tsx** (modified)
   - Use CartContext instead of local alert
   - Add products to cart with selected quantity

5. **App.tsx** (modified)
   - Wrap with CartProvider
   - Add /cart route

## Implementation Checklist

- [ ] Create CartContext with state management
- [ ] Create Cart page component
- [ ] Update Navigation to show cart icon with badge
- [ ] Update Products to use CartContext
- [ ] Add cart route to App
- [ ] Ensure cart works for guest users
- [ ] Test all cart operations manually
- [ ] Verify e2e tests pass

## Testing Strategy

### E2E Tests (Playwright)
Existing tests in `tests/e2e/products.spec.ts` already validate:
- Cart icon shows item count after adding product
- Cart page is accessible via cart icon
- Cart items display with correct quantity

### Manual Testing
1. Add items to cart from Products page
2. Verify cart count badge updates
3. Navigate to cart page
4. Update quantities in cart
5. Remove items from cart
6. Verify totals calculate correctly
7. Test empty cart state

## Success Criteria
- [ ] Cart icon visible in navigation
- [ ] Cart badge shows correct item count
- [ ] Products can be added to cart
- [ ] Cart page displays all items correctly
- [ ] Quantities can be updated in cart
- [ ] Items can be removed from cart
- [ ] Cart totals calculate correctly
- [ ] Cart works for guest users (no authentication)
- [ ] E2E tests pass
- [ ] No console errors or warnings
