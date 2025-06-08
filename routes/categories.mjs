import express from 'express';
import {
    getAll,
    save
} from '../controllers/controller-category.js';

const route = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name_category
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único de MongoDB
 *           example: 60f5b9f9f8db4f32fdsds4
 *         name_category:
 *           type: string
 *           description: Nombre de la categoría
 *           example: Pizza
 *         description:
 *           type: string
 *           description: Descripción de la categoría
 *           example: Variedad de pizzas clásicas y especiales
 */


/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener todas las categorías registradas
 *     tags: [Categories Controller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Categorías obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   description: Indica si la operación fue exitosa
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       '401':
 *         description: El cliente no ha sido autenticado o el token expiró
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   description: Indica si se inició sesión o no
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Indica el resultado de la solicitud
 *                   example: Session Expired
 *                 data:
 *                   type: string
 *                   description: Datos de la solicitud
 *                   example: null
 *       '403':
 *         description: El cliente no posee los permisos necesarios para cierto contenido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   description: Indica si se inició sesión o no
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Indica el resultado de la solicitud
 *                   example: Unauthorized role
 *                 data:
 *                   type: string
 *                   description: Datos de la solicitud
 *                   example: null
 *       '500':
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   description: Indica si se inició sesión o no
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Indica el resultado de la solicitud
 *                   example: Error interno del servidor
 */
route.get('/', getAll);

/**
 * @swagger
 * /categories/:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categories Controller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name_category
 *               - description
 *             properties:
 *               name_category:
 *                 type: string
 *                 example: Bebida
 *               description:
 *                 type: string
 *                 example: Categoría de productos líquidos como jugos o gaseosas
 *     responses:
 *       '201':
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   description: Indica si la operación fue exitosa
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       '401':
 *         description: El cliente no ha sido autenticado o el token expiró
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   description: Indica si se inició sesión o no
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Indica el resultado de la solicitud
 *                   example: Session Expired
 *                 data:
 *                   type: string
 *                   description: Datos de la solicitud
 *                   example: null
 *       '403':
 *         description: El cliente no posee los permisos necesarios para cierto contenido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   description: Indica si se inició sesión o no
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Indica el resultado de la solicitud
 *                   example: Unauthorized role
 *                 data:
 *                   type: string
 *                   description: Datos de la solicitud
 *                   example: null
 *       '409':
 *         description: Conflicto, la categoría ya existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   description: Indica si la operación fue exitosa
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Indica el resultado de la solicitud
 *                   example: Category already exists
 *       '500':
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   description: Indica si se inició sesión o no
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Indica el resultado de la solicitud
 *                   example: E11000 duplicate key error collection
 */
route.post('/', save);


export default route;