import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {

    openapi: '3.0.0',
    info: {
        title: 'API Pizzeria',
        version: '1.0.0',
        description: 'API de una pizzeria',
        license: {
            name: 'Licensed Under MIT',
            url: 'https://spdx.org/licenses/MIT.html'
        },
        contact: {
            name: 'Migue Alfonso',
            url: 'https://github.com/MiguelAlfonso1723'
        }
    },
    tags: [{
        name: "Loggin Controller",
        description: "Creación de usuario e inicio de sesión"
    },
    {
        name: "Menus Controller",
        description: "Controlador de productos del menú"
    },
    {
        name: "Categories Controller",
        description: "Controlador de categorías del menú"
    },
    {
        name: "Order Controller",
        description: "Controlador de pedidos"
    }],
    servers: [{
        url: 'http://localhost:3000',
        //url: 'https://apinodejs-2h6b.onrender.com',
        description: 'Development API Companies and Products'
    }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Ingresa el token JWT en el formato: Bearer <token>'
            }
        }
    },
    security: [{
        bearerAuth: []
    }]

}


const options = {
    swaggerDefinition,
    apis: ['./routes/*.mjs']
}

const swaggerSepc = swaggerJSDoc(options);

export default swaggerSepc;