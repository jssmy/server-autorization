import { IAccessToken } from '../interfaces/iaccess-token';
import { IGenerateAccess } from '../interfaces/igenerate-access';
import { IRefreshToken } from '../interfaces/irefresh-token';
import { IUser } from '../interfaces/iuser';
import { DateHelper } from './date-helper';
import { Helper } from './helpers';
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
export class OAuthHelper {

    public static generateAccess(user: IUser): IGenerateAccess {

        const publicInformation: IUser = {
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            accounInformation: {
                profileImage: user.accounInformation.profileImage
            }
        };

        const refresh: IRefreshToken = this.refreshToken(user);
        const expiresIn = refresh.expires_in;
        const token= jwt.sign(user, Helper.privateKey('private.pem'), { algorithm: 'RS256'} , { expiresIn });
        
        const accessToken: IAccessToken = {
            token_type: 'Bearer',
            access_token: token,
            refresh_token: refresh.refresh_token,
            expires_in: refresh.expires_in,
            meta_data: Buffer.from(JSON.stringify(publicInformation)).toString('base64'),
        };

        const generated: IGenerateAccess = {
            access_token: accessToken,
            refresh_token: refresh
        };

        return generated;
    }

    private static refreshToken(user: IUser): IRefreshToken {
        const refresh: IRefreshToken = {
            refresh_token: crypto.randomBytes(100).toString('hex'),
            created: DateHelper.current().getTime(),
            expires_in: DateHelper.expiresTime(1),
            state: true,
            user_id: user.id
        };
        return refresh;
    }


}