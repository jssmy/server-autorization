import { query, Request, Response }  from 'express';
import { DateHelper } from '../helpers/date-helper';
import { Helper } from '../helpers/helpers';
import { IUser } from '../models/iuser';
import { Controller } from './controller';
const jwt = require('jsonwebtoken');


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
                const expiresIn = DateHelper.expiresTime(1);
                const doc = query.docs[0];
                const privateInformation: IUser = {
                    id: doc.id,
                    email: doc.data().email,
                    name: doc.data().name,
                    lastName: doc.data().lastName
                };
                const user = doc.data();
                const token= jwt.sign(privateInformation, Helper.privateKey('private.pem'), { algorithm: 'RS256'} , { expiresIn });
                const autorization = {
                    user,
                    accessToken: token,
                    expiresIn
                };
                
                res.status(200).send({
                    message: 'Usuario autenticado',
                    status: 200,
                    autorization: Buffer.from(JSON.stringify(autorization)).toString('base64'),
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