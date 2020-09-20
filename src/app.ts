/**
 * IMPORTS
 */
import express = require('express');
import { AuthController } from './commons/controllers/auth-controller';
import { UserController } from './commons/controllers/user-controller';

/**
 * CONSTANTS
 */
const app = express();
const cors = require('cors');

/**
 * APP CONFIG
 */
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded());
app.set('port', process.env.PORT || 3000);


/**
 * ROUTES
*/
app.get('/', (req, res) => {
    res.send('default');
});

app.post('/api/create/user', (req, res) => UserController.create(req, res));
app.post('/api/auth/user', (req, res) => AuthController.auth(req, res));


export default app;