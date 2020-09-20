import { Controller } from './controller';
import { Request, Response }  from 'express';
import { IUser } from '../models/iuser';
import { DateHelper } from '../helpers/date-helper';

export class UserController extends Controller {
    protected static collectionName: string = 'users'
    public static async create(req: Request, res: Response) {
        try {
            const user: IUser = req.body;
            user.created = DateHelper.current().getTime();
            user.updated = DateHelper.current().getTime();
            user.state = true;
            await this.collection().doc().create(user);
            res.status(200).send({
                message: `Se ha creado el usuario`,
                status: 500
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Ha ocurrido un problema',
                status: 500
            });
        }
    }
    public static update() {}
    public static delete() {}
}
