import express from 'express';
import 'dotenv/config'
import swaggerUI from 'swagger-ui-express'
import swaggerSpec from './swagger.js'
import cors from 'cors'
import './drivers/connect-db.mjs'
import routeSignin from './routes/signin.mjs'
import routeSignup from './routes/signup.mjs'
import routeCategory from './routes/categories.mjs'
import routeMenu from './routes/menus.mjs'
import routerOrder from './routes/orders.mjs'

const app = express()

app.set('PORT', process.env.PORT || 3000)

app.use(cors())
app.use(express.json())

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use('/signin', routeSignin);
app.use('/signup', routeSignup);
app.use('/categories', routeCategory);
app.use('/menus', routeMenu);
app.use('/orders', routerOrder);

app.listen(app.get('PORT'), () => console.log(`Server Ready at Port ${app.get('PORT')}`));