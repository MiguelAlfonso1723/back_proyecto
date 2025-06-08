import express from 'express';
import {
    getAllActive,
    getAllFinished,
    salesRecordDaily,
    salesRecordMonthly,
    createOrder,
    addProductToOrder,
    cancelOrder,
    finishOrder,
    getOrderById,
    removeProductFromOrder,
    updateQuantityProduct
} from '../controllers/controller-order.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - products
 *         - order_type
 *         - is_active
 *         - is_cancelled
 *         - date
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único de la orden
 *           example: 664e42db614d276f1111abcd
 *         products:
 *           type: array
 *           description: Lista de productos en la orden
 *           items:
 *             type: object
 *             required:
 *               - menu
 *               - quantity
 *             properties:
 *               menu:
 *                 #ref: '#/components/schemas/Menu'
 *                 type: string
 *                 description: ID del producto del menú (referencia a Menu)
 *                 example: 60f5b9f9f8db4f32fdsds4
 *               quantity:
 *                 type: integer
 *                 description: Cantidad del producto en la orden
 *                 example: 2
 *         order_type:
 *           type: string
 *           enum: [llevar, domicilio, local]
 *           description: Tipo de orden
 *           example: domicilio
 *         is_active:
 *           type: boolean
 *           description: Indica si la orden está activa
 *           example: true
 *         is_cancelled:
 *           type: boolean
 *           description: Indica si la orden fue cancelada
 *           example: false
 *         date:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora en que se creó la orden
 *           example: 2025-06-07T14:00:00.000Z
 */

/**
 * @swagger
 * /orders/active:
 *   get:
 *     summary: Obtener todas las órdenes activas
 *     tags: [Order Controller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes activas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: No autorizado. El token no es válido o no tiene permisos de camarero
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token inválido o sin permisos
 *                 data:
 *                   type: null
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error al obtener órdenes activas
 */
router.get('/active', getAllActive);

/**
 * @swagger
 * /orders/finished:
 *   get:
 *     summary: Obtener todas las órdenes finalizadas (no activas y no canceladas)
 *     tags: [Order Controller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes finalizadas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: No autorizado. El token no es válido o no tiene permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token inválido o sin permisos
 *                 data:
 *                   type: null
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error al obtener órdenes finalizadas
 */
router.get('/finished', getAllFinished);

/**
 * @swagger
 * /orders/sales/daily:
 *   get:
 *     summary: Obtener registro de ventas diarias, incluyendo órdenes canceladas
 *     tags: [Order Controller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen de ventas del día obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     pedidos:
 *                       type: object
 *                       properties:
 *                         ventas:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                               example: 120000
 *                             cantidad:
 *                               type: integer
 *                               example: 5
 *                         llevar:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                               example: 30000
 *                             cantidad:
 *                               type: integer
 *                               example: 1
 *                         domicilio:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                               example: 50000
 *                             cantidad:
 *                               type: integer
 *                               example: 2
 *                         local:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                               example: 40000
 *                             cantidad:
 *                               type: integer
 *                               example: 2
 *                         cancelados:
 *                           type: object
 *                           properties:
 *                             cantidad:
 *                               type: integer
 *                               example: 1
 *       401:
 *         description: No autorizado. El token no es válido o no tiene permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token inválido o sin permisos
 *                 data:
 *                   type: null
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error del servidor
 */
router.get('/sales/daily', salesRecordDaily);

/**
 * @swagger
 * /orders/sales/monthly:
 *   get:
 *     summary: Obtener registro de ventas del mes, incluyendo órdenes canceladas
 *     tags: [Order Controller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen de ventas del mes obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     pedidos:
 *                       type: object
 *                       properties:
 *                         ventas:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                               example: 840000
 *                             cantidad:
 *                               type: integer
 *                               example: 60
 *                         llevar:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                               example: 180000
 *                             cantidad:
 *                               type: integer
 *                               example: 12
 *                         domicilio:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                               example: 420000
 *                             cantidad:
 *                               type: integer
 *                               example: 30
 *                         local:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                               example: 240000
 *                             cantidad:
 *                               type: integer
 *                               example: 18
 *                         cancelados:
 *                           type: object
 *                           properties:
 *                             cantidad:
 *                               type: integer
 *                               example: 3
 *       401:
 *         description: No autorizado. El token no es válido o no tiene permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token inválido o sin permisos
 *                 data:
 *                   type: null
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error del servidor
 */
router.get('/sales/monthly', salesRecordMonthly);

/**
 * @swagger
 * /orders/:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Order Controller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_type
 *             properties:
 *               order_type:
 *                 type: string
 *                 enum: [llevar, domicilio, local]
 *                 description: Tipo de orden
 *                 example: local
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Campo 'order_type' faltante o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: El campo 'order_type' es obligatorio
 *                 data:
 *                   type: null
 *       401:
 *         description: No autorizado. Token inválido o sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token inválido o sin permisos
 *                 data:
 *                   type: null
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error al crear la orden
 */
router.post('/', createOrder);

/**
 * @swagger
 * /orders/add-product:
 *   patch:
 *     summary: Agregar un producto a una orden activa
 *     tags: [Order Controller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - menuId
 *               - quantity
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID de la orden activa
 *                 example: "665fae2e4e7b87210ac7dc49"
 *               menuId:
 *                 type: string
 *                 description: ID del producto del menú a agregar
 *                 example: "665fae8c4e7b87210ac7dc4d"
 *               quantity:
 *                 type: integer
 *                 description: Cantidad del producto
 *                 example: 2
 *     responses:
 *       200:
 *         description: Producto agregado exitosamente a la orden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Datos inválidos o incompletos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Los campos 'orderId', 'menuId' y 'quantity' son obligatorios"
 *                 data:
 *                   type: null
 *       401:
 *         description: No autorizado. Token inválido o sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token inválido o sin permisos
 *                 data:
 *                   type: null
 *       404:
 *         description: Orden no encontrada o no está activa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Orden no encontrada o no está activa
 *                 data:
 *                   type: null
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.patch('/add-product', addProductToOrder);

/**
 * @swagger
 * /orders/cancel/{orderId}:
 *   patch:
 *     summary: Cancelar una orden activa
 *     tags: [Order Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden a cancelar
 *         example: "665fae2e4e7b87210ac7dc49"
 *     responses:
 *       200:
 *         description: Orden cancelada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "El campo 'orderId' es obligatorio"
 *                 data:
 *                   type: null
 *       401:
 *         description: No autorizado. Token inválido o sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token inválido o sin permisos
 *                 data:
 *                   type: null
 *       404:
 *         description: Orden no encontrada o no activa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Orden no encontrada o no está activa
 *                 data:
 *                   type: null
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.patch('/cancel/:orderId', cancelOrder);

/**
 * @swagger
 * /orders/finish/{orderId}:
 *   patch:
 *     summary: Finalizar una orden activa
 *     tags: [Order Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden a finalizar
 *         example: "665fae2e4e7b87210ac7dc49"
 *     responses:
 *       200:
 *         description: Orden finalizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "El campo 'orderId' es obligatorio"
 *                 data:
 *                   type: null
 *       401:
 *         description: No autorizado. Token inválido o sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token inválido o sin permisos
 *                 data:
 *                   type: null
 *       404:
 *         description: Orden no encontrada o no activa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Orden no encontrada o no está activa
 *                 data:
 *                   type: null
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.patch('/finish/:orderId', finishOrder);

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Obtener una orden activa por ID
 *     tags: [Order Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden a consultar
 *         example: "665fae2e4e7b87210ac7dc49"
 *     responses:
 *       200:
 *         description: Orden obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "El campo 'orderId' es obligatorio"
 *                 data:
 *                   type: null
 *       401:
 *         description: No autorizado. Token inválido o sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token inválido o sin permisos
 *                 data:
 *                   type: null
 *       404:
 *         description: Orden no encontrada o no está activa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Orden no encontrada o no está activa
 *                 data:
 *                   type: null
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.get('/:orderId', getOrderById);

/**
 * @swagger
 * /orders/remove-product:
 *   patch:
 *     summary: Eliminar un producto de una orden activa
 *     tags: [Order Controller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - menuId
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID de la orden
 *                 example: "665fae2e4e7b87210ac7dc49"
 *               menuId:
 *                 type: string
 *                 description: ID del producto a eliminar
 *                 example: "665fab6e4e7b87210ac7dbef"
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Faltan parámetros obligatorios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Los campos 'orderId' y 'menuId' son obligatorios"
 *                 data:
 *                   type: null
 *       401:
 *         description: Token inválido o sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token inválido o sin permisos"
 *                 data:
 *                   type: null
 *       404:
 *         description: Orden no encontrada o no está activa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Orden no encontrada o no está activa"
 *                 data:
 *                   type: null
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
router.patch('/remove-product', removeProductFromOrder);

/**
 * @swagger
 * /orders/update-quantity:
 *   patch:
 *     summary: Actualizar la cantidad de un producto en una orden activa
 *     tags: [Order Controller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - menuId
 *               - quantity
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID de la orden
 *                 example: "665fae2e4e7b87210ac7dc49"
 *               menuId:
 *                 type: string
 *                 description: ID del producto en la orden
 *                 example: "665fab6e4e7b87210ac7dbef"
 *               quantity:
 *                 type: integer
 *                 description: Nueva cantidad del producto
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cantidad actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Parámetros faltantes o inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Los campos 'orderId', 'menuId' y 'quantity' son obligatorios"
 *                 data:
 *                   type: null
 *       401:
 *         description: Token inválido o sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token inválido o sin permisos"
 *                 data:
 *                   type: null
 *       404:
 *         description: Orden o producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Orden no encontrada o no está activa"
 *                 data:
 *                   type: null
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
router.patch('/update-quantity', updateQuantityProduct);

export default router