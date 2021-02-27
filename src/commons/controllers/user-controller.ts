import { Request, Response } from 'express';
import { IUser } from '../interfaces/iuser';
import { DateHelper } from '../helpers/date-helper';
import { User } from '../models/user.class';
import { Validate } from '../helpers/validate-heper';
import { IGenericResponse } from '../interfaces/igeneric-response';
import { IGenericSuccess } from '../interfaces/igeneric-success';
import { IGenericError } from '../interfaces/igeneric-error';
import { OAuthHelper } from '../helpers/oauth-helper';
import { RefreshToken } from '../models/refresh-token.class';
import { AuthMessageHelper } from '../helpers/auth-messages-helper';
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
            const userFind = await User.findByEmail(user.email);

            if (userFind) {
                const generic: IGenericError = {
                    error: 'use_already_exists',
                    error_description: 'User already exists'
                };
                return res.status(409).send(generic);
            }

            const userCreated =  await User.create(user);
            const generated = OAuthHelper.generateAccess(userCreated);
            await  RefreshToken.create(generated.refresh_token);
            const response = AuthMessageHelper.set(generated.access_token);
            return res.status(response.status).send(response.body);

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
