import express from 'express'
import {
    getAll,
    save,
    update,
    remove,
    updateAvailability
} from "../controllers/controller-menu.js";

const route = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       required:
 *         - name_product
 *         - price
 *         - category
 *         - capasity
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único de MongoDB
 *           example: 60f5b9f9f8db4f32fdsds4
 *         name_product:
 *           type: string
 *           description: Nombre del producto del menú
 *           example: Pizza Hawaiana
 *         price:
 *           type: number
 *           format: float
 *           description: Precio del producto
 *           example: 23000
 *         category:
 *           $ref: '#/components/schemas/Category'
 *           type: string
 *           description: ID de la categoría asociada al producto
 *           example: 60f5b9f9f8db4f32ab1c1234
 *         capasity:
 *           type: integer
 *           description: Cantidad de personas para las que está pensado el producto
 *           example: 2
 *         is_available:
 *           type: boolean
 *           description: Indica si el producto está disponible
 *           example: true
 */


/**
 * @swagger
 * /menus/:
 *   get:
 *     summary: Obtener todos los productos del menú registrados
 *     tags: [Menus Controller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Productos del menú obtenidos exitosamente
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
 *                     $ref: '#/components/schemas/Menu'
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
 * /menus/:
 *   post:
 *     summary: Crear un nuevo producto del menú
 *     tags: [Menus Controller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name_product
 *               - price
 *               - category
 *               - capasity
 *             properties:
 *               name_product:
 *                 type: string
 *                 description: Nombre del producto
 *                 example: Pizza Hawaiana
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *                 example: 25000
 *               category:
 *                 type: string
 *                 description: ID de la categoría (referencia a Category)
 *                 example: 60f5b9f9f8db4f32fdsds4
 *               capasity:
 *                 type: number
 *                 description: Cantidad disponible
 *                 example: 10
 *               is_available:
 *                 type: boolean
 *                 description: Indica si el producto está disponible
 *                 example: true
 *     responses:
 *       '201':
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Menu created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Menu'
 *       '401':
 *         description: El cliente no ha sido autenticado o el token expiró
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
 *                   example: Session Expired
 *                 data:
 *                   type: string
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
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized role
 *                 data:
 *                   type: string
 *                   example: null
 *       '409':
 *         description: Conflicto, el menú ya existe
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
 *                   example: El menú ya existe
 *                 data:
 *                   type: string
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
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
route.post('/', save);

/**
 * @swagger
 * /menus/{id}:
 *   put:
 *     summary: Actualizar un producto del menú por ID
 *     tags: [Menus Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto del menú a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_product:
 *                 type: string
 *                 description: Nombre del producto
 *                 example: Pizza Mexicana
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *                 example: 28000
 *               category:
 *                 type: string
 *                 description: ID de la categoría
 *                 example: 60f5b9f9f8db4f32fdsds4
 *               capasity:
 *                 type: number
 *                 description: Cantidad disponible
 *                 example: 5
 *               is_available:
 *                 type: boolean
 *                 description: Disponibilidad del producto
 *                 example: false
 *     responses:
 *       '200':
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Menu updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Menu'
 *       '401':
 *         description: El cliente no ha sido autenticado o el token expiró
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
 *                   example: Session Expired
 *                 data:
 *                   type: string
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
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized role
 *                 data:
 *                   type: string
 *                   example: null
 *       '404':
 *         description: Producto no encontrado
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
 *                   example: Menu not found
 *                 data:
 *                   type: string
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
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
route.put('/:id', update);

/**
 * @swagger
 * /menus/{id}:
 *   delete:
 *     summary: Eliminar un producto del menú por ID
 *     tags: [Menus Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto del menú a eliminar
 *     responses:
 *       '200':
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Menu deleted successfully
 *                 data:
 *                   $ref: '#/components/schemas/Menu'
 *       '401':
 *         description: El cliente no ha sido autenticado o el token expiró
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
 *                   example: Session Expired
 *                 data:
 *                   type: string
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
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized role
 *                 data:
 *                   type: string
 *                   example: null
 *       '404':
 *         description: Producto no encontrado
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
 *                   example: Menu not found
 *                 data:
 *                   type: string
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
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
route.delete('/:id', remove);

/**
 * @swagger
 * /menus/availability/{id}:
 *   patch:
 *     summary: Actualizar disponibilidad de un producto del menú por ID
 *     tags: [Menus Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto del menú
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_available:
 *                 type: boolean
 *                 description: Nueva disponibilidad del producto
 *                 example: false
 *     responses:
 *       '200':
 *         description: Disponibilidad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Menu availability updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Menu'
 *       '401':
 *         description: El cliente no ha sido autenticado o el token expiró
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
 *                   example: Session Expired
 *                 data:
 *                   type: string
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
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized role
 *                 data:
 *                   type: string
 *                   example: null
 *       '404':
 *         description: Producto no encontrado
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
 *                   example: Menu not found
 *                 data:
 *                   type: string
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
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
route.patch('/availability/:id', updateAvailability);


export default route;