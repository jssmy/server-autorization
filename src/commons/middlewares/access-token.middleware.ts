import { NextFunction } from "express";
import { Request, Response } from 'express';
import { GrantType } from "../emuns/grant-type.enum";
import { AuthErrorTypes, OauthError } from "../constants/oauth.errors";
import { IGenericError } from "../interfaces/igeneric-error";
import { SocialAuth } from "../helpers/social-auth";
import e = require("express");
import { HttpCode } from "../emuns/http-code.enum";
import { ISocialProvider } from "../interfaces/isocial-provider";
import { AuthErrorHelper } from "../helpers/auth-error-helper";
import { IUser } from "../interfaces/iuser";

export class AccessTokenMiddleware {
    public static async validate(req: Request, res: Response, next: NextFunction) {

        const grant = req.header('grant_type');

        if (!grant) {
            const error = AuthErrorHelper.generic(AuthErrorTypes.missingGranType);
            return res.status(error.status).send(error.body);
        }

        if ([
            GrantType.refresh_token.toString(),
            GrantType.password.toString(),
            GrantType.logout.toString(),
            GrantType.access_social_provider.toString(),
            GrantType.create_user.toString()
        ].indexOf(grant) === -1) {
            const error = AuthErrorHelper.generic(AuthErrorTypes.invalidGrantType);
            return res.status(error.status).send(error.body);
        }

        if (grant === GrantType.password) { // valid header token | password
            if (!req.header('email')) {
                const error = AuthErrorHelper.generic(AuthErrorTypes.missingEmailCredetential);
                return res.status(error.status).send(error.body);
            } else if (!req.header('password')) {
                const error = AuthErrorHelper.generic(AuthErrorTypes.missingPasswordCredential);
                return res.status(error.status).send(error.body);
            }

        } else if (grant === GrantType.refresh_token) { // valid header token | refresh token
            if (!req.header('refresh_token')) {
                const error = AuthErrorHelper.generic(AuthErrorTypes.missingRefreshToken);
                return res.status(error.status).send(error.body);
            }
        } else if (grant === GrantType.access_social_provider) { // validate grant access social
            if (!req.header('access_token')) { // google | facebook
                const error = AuthErrorHelper.generic(AuthErrorTypes.missingAccessToken);
                return res.status(error.status).send(error.body);
            }
            const userProvider: IUser = req.body;
            if (['google', 'facebook'].indexOf(userProvider.accounInformation.provider) === -1) {
                const error = AuthErrorHelper.generic(AuthErrorTypes.invalidProvider);
                return res.status(error.status).send(error.body);
            }
            if (userProvider.accounInformation.provider === 'google') {
                const generic = await SocialAuth.google(req.header('id_token'));
                if (generic.status !== HttpCode.success) {
                    const error = AuthErrorHelper.generic(AuthErrorTypes.invalidAccessToken);
                    return res.status(error.status).send(error.body);
                }
            } else if (userProvider.accounInformation.provider === 'facebook') {

            }

        }
        return next();
    }
}
