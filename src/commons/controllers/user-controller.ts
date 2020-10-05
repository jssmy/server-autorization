import { Request, Response }  from 'express';
import { IUser } from '../interfaces/iuser';
import { DateHelper } from '../helpers/date-helper';
import { User } from '../models/user.class';

export class UserController {
    public static async create(req: Request, res: Response) {
        try {
            const user: IUser = req.body;
            user.created = DateHelper.current().getTime();
            user.updated = DateHelper.current().getTime();
            user.state = true;
            await User.collection().doc().create(user);
            res.status(200).send({
                message: `Se ha creado el usuario`,
                status: 500
            });
        } catch (error) {
            res.status(500).send({
                message: 'Ha ocurrido un problema',
                status: 500
            });
        }
    }
    public static update() {}
    public static delete() {}
}
