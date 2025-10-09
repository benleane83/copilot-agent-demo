/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API endpoints for managing shopping cart
 */

import express from 'express';
import { products } from '../seedData';

const router = express.Router();

// Simple cart storage
interface CartItem {
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

interface Cart {
    items: CartItem[];
    subtotal: number;
    total: number;
    itemCount: number;
}

let cart: Cart = {
    items: [],
    subtotal: 0,
    total: 0,
    itemCount: 0
};

// Get current cart
router.get('/', (req, res) => {
    res.json(cart);
});

// Add item to cart
router.post('/items', (req, res) => {
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ error: 'Valid productId and quantity are required' });
    }
    
    const product = products.find(p => p.productId === productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].subtotal = cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].unitPrice;
    } else {
        const newItem = {
            productId,
            quantity,
            unitPrice: product.price,
            subtotal: quantity * product.price
        };
        cart.items.push(newItem);
    }
    
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.total = cart.subtotal;
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json(cart);
});

// Update item quantity
router.put('/items/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: 'Valid quantity is required' });
    }
    
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found in cart' });
    }
    
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].subtotal = cart.items[itemIndex].quantity * cart.items[itemIndex].unitPrice;
    
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.total = cart.subtotal;
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json(cart);
});

// Remove item from cart
router.delete('/items/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found in cart' });
    }
    
    cart.items.splice(itemIndex, 1);
    
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.total = cart.subtotal;
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json(cart);
});

// Checkout
router.post('/checkout', (req, res) => {
    if (cart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }
    
    const orderId = Math.floor(Math.random() * 10000) + 1000;
    
    cart = {
        items: [],
        subtotal: 0,
        total: 0,
        itemCount: 0
    };
    
    res.json({
        orderId,
        message: 'Order created successfully'
    });
});

export default router;