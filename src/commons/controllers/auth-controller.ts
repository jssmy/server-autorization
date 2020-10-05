import { Request, Response }  from 'express';
import { GrantType } from '../emuns/grant-type.enum';
import { HttpCode } from '../emuns/http-code.enum';
import { OauthError } from '../errors/oauth.errors';
import { DateHelper } from '../helpers/date-helper';
import { OAuthHelper } from '../helpers/oauth-helper';
import { IGenericError } from '../interfaces/igeneric-error';
import { IGenericResponse } from '../interfaces/igeneric-response';
import { IRefreshToken } from '../interfaces/irefresh-token';
import { IUser } from '../interfaces/iuser';
import { RefreshToken } from '../models/refresh-token.class';
import { User } from '../models/user.class';

export class AuthController  {
    
    public static async auth(req: Request, res: Response) {
        try {            
            switch(req.header('grant_type')) {
                case GrantType.refresh_token: {
                    const generic: IGenericResponse = await this.refreshToken(req.header('refresh_token'));
                    return res.status(generic.status).send(generic.body);
                }
                case GrantType.password: {
                    const generic : IGenericResponse = await this.accessToken(req.header('email').toString(), req.header('password').toString());
                    return res.status(generic.status).send(generic.body);
                }
            }
        } catch (error) {
            return res.status(500).send({
                message: 'Ha sucedio un problema'
            });
        }
    }

    private static async accessToken(email: string, password: string): Promise<IGenericResponse> {
        try {

            const res: IGenericResponse = await User.findByCredential(email, password).then(async (user: IUser) => {
                
                if (!user) { // invalid credetentials
                    const error: IGenericError = {
                        error: OauthError.invalidCredencials.error,
                        error_description: OauthError.invalidCredencials.description
                    };
                    const generic: IGenericResponse = {
                        status: OauthError.invalidCredencials.status,
                        body: error
                    }
                    return generic;
                }

                const generate = OAuthHelper.generateAccess(user); // generate accessToken

                await RefreshToken.create(generate.refresh_token);

                const generic: IGenericResponse = {
                    status: HttpCode.success,
                    body: generate.access_token
                };
                return generic;

            });

            return res;

        } catch (error) {
            throw new Error(error);
        }
    }

    private static async refreshToken(refresh: string): Promise<IGenericResponse> {
        try {
            const refreshToken: IRefreshToken = await RefreshToken.find(refresh);
        if (!refreshToken) {
            const error: IGenericError = {
                error: OauthError.invalidRefreshToken.error,
                error_description: OauthError.invalidRefreshToken.description
            };
            const generic: IGenericResponse = {
                status: OauthError.invalidRefreshToken.status,
                body: error
            };
            return generic;
        }
        console.log('expires_in', DateHelper.isExpired(refreshToken.expires_in));
        if (DateHelper.isExpired(refreshToken.expires_in)) {
            const error: IGenericError = {
                error: OauthError.expiredRefreshToken.error,
                error_description: OauthError.expiredRefreshToken.description
            };
            const generic: IGenericResponse = {
                status: OauthError.expiredRefreshToken.status,
                body: error
            };

            return generic;
        }

        // generate new access token
        const user: IUser = await User.find(refreshToken.user_id);
        if (!user) {
            const error: IGenericError = {
                error: OauthError.invalidUser.error,
                error_description: OauthError.invalidUser.description
            };
            const generic: IGenericResponse = {
                status: OauthError.invalidUser.status,
                body: error
            };

            return generic;
        }

        const generate = OAuthHelper.generateAccess(user); // generate accessToken
        console.log(generate);
        await RefreshToken.create(generate.refresh_token); // save new refresh
        
        await RefreshToken.disable(refreshToken); // disable refreshToken
        
        const generic: IGenericResponse = {
            status: HttpCode.success,
            body: generate.access_token
        };
        return generic;
        } catch (error) {
            throw new Error(error);
        }
    }
}