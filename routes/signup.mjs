import express from 'express'
import register from '../controllers/controller-signup.js'

const route = express.Router()

/**
 * @swagger
 * /:
 * /signup/:
 *  post:
 *      tags: [Loggin Controller]
 *      summary: Crear usuario
 *      description: Creación de usuario con correo y contraseña
 *      requestBody:
 *          description: Con el usuario (correo) y contraseña crear una cuenta
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object    
 *                      properties:
 *                          mail:
 *                              type: string
 *                              description: Correo con el cual se registro
 *                              example: example@gmail.com
 *                          password:
 *                              type: string
 *                              description: Contraseña con la que se inicia sesión
 *                              example: IsthismyP@ssw0rd
  *                          role:
 *                              type: string
 *                              description: rol del usuario, puede ser administrador o camarero
 *                              enum: [administrador, camarero]
 *                              example: camarero
 *      responses:
 *         '201':
 *              description: 
 *              content:
 *                  application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                            state:
 *                              type: boolean
 *                              description: Indica que la creación fue exitosa
 *                              example: true
 *                            data:
 *                             type: object
 *                             properties:
 *                                  mail:
 *                                      type: string
 *                                      description: Correo con el cual se registro
 *                                      example: example@gmail.com *  
 *                                  role:
 *                                      type: string
 *                                      description: Rol del usuario, puede ser administrador o camarero
 *                                      example: camarero
 *                                  _id:
 *                                      type: string
 *                                      description: Especifica los Indentificadores de los productos pertenecen a dicha compañia
 *                                      example: 60f5b9b0c8d8c7b6d4b6d4
 *                                  __v:
 *                                     type: int
 *                                     description: clave de versión que se utiliza para registrar las revisiones de un documento.
 *                                     example: 0 
 *  
 *         '401':
 *              description: Esta respuesta significa que el usuario no esta autorizado para usar el endpoint.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                            state:
 *                              type: boolean
 *                              description: Indica si se inicio sesión o no
 *                              example: false
 *                            message:
 *                              type: string
 *                              description: Indica el resultado de la solicitud
 *                              example: Unauthorized role
 *                            token:
 *                              type: string
 *                              description: token de acceso
 *                              example: null
 *         '400':
 *              description: Esta respuesta significa que el servidor no pudo interpretar la solicitud dada una sintaxis inválida.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                            state:
 *                              type: boolean
 *                              description: Indica si se inicio sesión o no
 *                              example: false
 *                            message:
 *                              type: string
 *                              description: Indica el resultado de la solicitud
 *                              example: User Don't Exist 
 *                            token:
 *                              type: string
 *                              description: token de acceso
 *                              example: null
 *         '409':
 *              description: Esta respuesta significa que ya existe un correo igual registrado.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                            state:
 *                              type: boolean
 *                              description: Indica si se inicio sesión o no
 *                              example: false
 *                            message:
 *                              type: string
 *                              description: Indica el resultado de la solicitud
 *                              example: Mail already registered 
 *                            token:
 *                              type: string
 *                              description: token de acceso
 *                              example: null
 *         '500':
 *              description: Error en el servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                            state:
 *                              type: boolean
 *                              description: Indica si se inicio sesión o no
 *                              example: false
 *                            message:
 *                              type: string
 *                              description: Indica el resultado de la solicitud
 *                              example: E11000 duplicate key error collection
 */
route.post('/', register);

export default route