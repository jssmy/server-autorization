import { NextFunction, response } from "express";
import { query, Request, Response }  from 'express';
import { GrantType } from "../emuns/grant-type.enum";
import { OauthError } from "../errors/oauth.errors";
import { IGenericError } from "../interfaces/igeneric-error";

export class AccessTokenMiddleware {
    public static validate(req: Request, res: Response, next: NextFunction) {
        
        const grant = req.header('grant_type');

        if (!grant) {

            const error: IGenericError = {
                error: OauthError.missingGranType.error,
                error_description: OauthError.missingGranType.description
            };
            
            return res.status(400).send(error);
        }

        if ([GrantType.refresh_token.toString(), GrantType.password.toString()].indexOf(grant) === -1) {

            const error: IGenericError = {
                error: OauthError.invalidGrantType.error,
                error_description: OauthError.invalidGrantType.description
            };

            return res.status(400).send(error);
        }

        if(grant === GrantType.password) { // valid header token | password

            if (!req.header('email')) {
                const error: IGenericError = {
                    error: OauthError.missingEmailCredetential.error,
                    error_description: OauthError.missingEmailCredetential.description
                };
                return  res.status(OauthError.missingEmailCredetential.status)
                        .send(error);
            } else if (!req.header('password')) {
                const error: IGenericError = {
                    error: OauthError.missingPasswordCredential.error,
                    error_description: OauthError.missingPasswordCredential.description
                };
                
                return res.status(OauthError.missingPasswordCredential.status)
                        .send(error);
            }

        } else if (grant === GrantType.refresh_token) { // valid header token | refresh token
            if (!req.header('refresh_token')) {
                const error: IGenericError = {
                    error: OauthError.missingRefreshToken.error,
                    error_description: OauthError.missingRefreshToken.description
                };
                return res.status(OauthError.missingRefreshToken.status)
                        .send(error);
            }
        }

        return next(); 
    }
}
