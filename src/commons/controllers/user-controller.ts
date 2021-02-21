import { Request, Response } from 'express';
import { IUser } from '../interfaces/iuser';
import { DateHelper } from '../helpers/date-helper';
import { User } from '../models/user.class';
import { Validate } from '../helpers/validate-heper';
import { IGenericResponse } from '../interfaces/igeneric-response';
import { IGenericSuccess } from '../interfaces/igeneric-success';

export class UserController {
    public static async create(req: Request, res: Response) {
        try {
            const user: IUser = req.body;
            Validate.set(user).check(['email', 'password', 'fullName']).valid();
            user.accounInformation = {
                coverImage: '',
                id: null,
                profileImage: 'https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg',
                provider: null
            };
            user.created = DateHelper.current().getTime();
            user.updated = DateHelper.current().getTime();
            user.state = true;
            const userFind = User.findByEmail(user.email);
            if (userFind) {
                const generic: IGenericSuccess = {
                    message: 'use_already_exists',
                    message_description: 'User already exists'
                };
                return res.status(409).send(generic);
            }

            await User.create(user);
            const generic: IGenericSuccess = {
                message: 'user_created',
                message_description: 'User has been created'
            };
            res.status(200).send(generic);

        } catch (error) {
            const generic: IGenericResponse = {
                status: error.status,
                body: error.body
            };
            return res.status(generic.status).send(generic.body);
        }
    }
    public static update() { }
    public static delete() { }
}
