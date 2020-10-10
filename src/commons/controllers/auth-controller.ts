import { Request, Response }  from 'express';
import { GrantType } from '../emuns/grant-type.enum';
import { AuthErrorTypes, OauthError } from '../constants/oauth.errors';
import { DateHelper } from '../helpers/date-helper';
import { OAuthHelper } from '../helpers/oauth-helper';
import { IGenericResponse } from '../interfaces/igeneric-response';
import { IRefreshToken } from '../interfaces/irefresh-token';
import { IUser } from '../interfaces/iuser';
import { RefreshToken } from '../models/refresh-token.class';
import { User } from '../models/user.class';
import { AuthMessagesType, OauthMessages } from '../constants/oauth.messges';
import { ISocialProvider } from '../interfaces/isocial-provider';
import { AuthErrorHelper } from '../helpers/auth-error-helper';
import { AuthMessageHelper } from '../helpers/auth-messages-helper';
import { SocialAuth } from '../helpers/social-auth';

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
                case GrantType.access_social_provider: {
                    const generic : IGenericResponse = await this.socialAccessToken(req.body);
                    return res.status(generic.status).send(generic.body);
                }
                default: {
                    return res.status(500).send({
                        message: 'Not grant_type'
                    });        
                }
            }
        } catch (error) {
            const generic : IGenericResponse = {
                status: 500,
                body: error
            };
            return res.status(generic.status).send(generic);
        }
    }

    private static async accessToken(email: string, password: string): Promise<IGenericResponse> {
        try {

            const res: IGenericResponse = await User.findByCredential(email, password).then(async (user: IUser) => {
                
                if (!user) { // invalid credetentials
                    return AuthErrorHelper.generic(AuthErrorTypes.invalidCredencials);
                }

                const generate = OAuthHelper.generateAccess(user); // generate accessToken

                await RefreshToken.create(generate.refresh_token);

                return AuthMessageHelper.set(generate.access_token);

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
            return AuthErrorHelper.generic(AuthErrorTypes.invalidRefreshToken);
        }

        if (DateHelper.isExpired(refreshToken.expires_in)) {
            return AuthErrorHelper.generic(AuthErrorTypes.expiredRefreshToken);
        }

        // generate new access token
        const user: IUser = await User.find(refreshToken.user_id);
        if (!user) {
            return AuthErrorHelper.generic(AuthErrorTypes.invalidUser);
        }

        const generate = OAuthHelper.generateAccess(user); // generate accessToken
   
        await RefreshToken.create(generate.refresh_token); // save new refresh
        
        await RefreshToken.disable(refreshToken); // disable refreshToken
        
        return AuthMessageHelper.set(generate.access_token);

        } catch (error) {
            throw new Error(error);
        }
    }

    public static async logout(req: Request, res: Response) {
        try {
            const generic: IGenericResponse = await RefreshToken.find(req.header('refresh_token')).then(async (refreshToken: IRefreshToken)=> {
                if (!refreshToken) {
                    return AuthErrorHelper.generic(AuthErrorTypes.invalidRefreshToken);
                }
    
                await RefreshToken.disable(refreshToken);
    
                return AuthMessageHelper.generic(AuthMessagesType.successLogout);
            });
        
            return res.status(generic.status).send(generic.body)
        } catch (error) {
            throw new Error(error);           
        }
    }

    public static async socialAccessToken(userProvider: ISocialProvider) {
        try {
            /// validate access token for provider
            let user: IUser = await User.findByProvider(userProvider);
            if (!user) { // user not found
                user  = {
                    email: userProvider.user.email,
                    name: userProvider.user.name,
                    lastName: userProvider.user.lastName,
                    accounInformation: {
                        coverImage: null,
                        profileImage: userProvider.user.profileImage,
                        id: userProvider.user.id,
                        provider: userProvider.provider,
                    }
                }
                await User.create(user);
            }

            const generate = OAuthHelper.generateAccess(user);
            await RefreshToken.create(generate.refresh_token);
            return AuthMessageHelper.set(generate.access_token)
            
        } catch (error) {
          throw new Error(error);   
        }
    }
}
