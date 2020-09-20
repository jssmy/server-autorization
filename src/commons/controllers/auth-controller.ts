import { query, Request, Response }  from 'express';
import { DateHelper } from '../helpers/date-helper';
import { Helper } from '../helpers/helpers';
import { Controller } from './controller';
const jwt = require('jsonwebtoken');
const jwtSimple = require('jwt-simple');

export class AuthController extends Controller {
    protected static collectionName = 'users';
    public static async auth(req: Request, res: Response) {
        try {
            await this.collection()
                .where('email', '==', req.body.email)
                .where('password', '==', req.body.password)
                .where('state', '==', true)
                .select('name', 'email','lastName')
                .limit(1)
                .get().then(query => {
                if(query.empty) {
                    res.status(401).send({
                        message: 'No se ha podido authenticar al usuario',
                        status: 401
                    });
                }
                const expiresIn = DateHelper.now().add(2, 'hours').toDate().getTime();
                const user = query.docs[0].data();
                const token= jwt.sign(user, Helper.privateKey('private.pem'), { algorithm: 'RS256'} , { expiresIn });
                const autorization = jwtSimple.encode({ user: user, token: token, expiresIn, created: DateHelper.current().getTime() }, 'env-dev-commerce.herokuapp.com');
                res.status(200).send({
                    message: 'Usuario autenticado',
                    status: 200,
                    autorization: autorization,
                });

            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Ha sucedio un problema'
            });
        }
    }
}