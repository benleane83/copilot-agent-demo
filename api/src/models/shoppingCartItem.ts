/**
 * @swagger
 * components:
 *   schemas:
 *     ShoppingCartItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           description: The unique identifier for the product
 *         quantity:
 *           type: integer
 *           description: The quantity of the product in the cart
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the product at the time it was added to the cart
 */
export interface ShoppingCartItem {
    productId: number;
    quantity: number;
    price: number;
}
