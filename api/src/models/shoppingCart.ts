/**
 * @swagger
 * components:
 *   schemas:
 *     ShoppingCart:
 *       type: object
 *       required:
 *         - cartId
 *         - items
 *       properties:
 *         cartId:
 *           type: string
 *           description: The unique identifier for the shopping cart
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ShoppingCartItem'
 *           description: The list of items in the shopping cart
 *         totalAmount:
 *           type: number
 *           format: float
 *           description: The total amount of all items in the cart
 */
import { ShoppingCartItem } from './shoppingCartItem';

export interface ShoppingCart {
    cartId: string;
    items: ShoppingCartItem[];
    totalAmount: number;
}
