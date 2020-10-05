import { HttpCode } from "../emuns/http-code.enum";

export const OauthError = {
    invalidGrantType: {
        error: 'invalid_grant_type',
        description: 'Request has invalid grant_type',
        status: HttpCode.unautorized
    },
    missingGranType: {
        error: 'missing_grant_type',
        description: 'Request missing grant_type',
        status: HttpCode.badRequest
    },
    missingEmailCredetential: {
        error: 'missing_email_credential',
        description: 'Request missing email credential',
        status: HttpCode.badRequest
    }, missingPasswordCredential: {
        error: 'missing_password_credential',
        description: 'Request missing password credential',
        status: HttpCode.badRequest
    },
    invalidCredencials: {
        error: 'no_authorizaded',
        description: 'Request has invalid credentials',
        status: HttpCode.unautorized
    },
    missingRefreshToken: {
        error: 'missing_refresh_token',
        description: 'Request missing refresh_token',
        status: HttpCode.badRequest
    },
    invalidRefreshToken: {
        error: 'invalid_refresh_token',
        description: 'Request has invalid refresh_token',
        status: HttpCode.unautorized
    },
    expiredRefreshToken: {
        error: 'expired_refresh_token',
        description: 'Request has expired refresh_token',
        status: HttpCode.unautorized
    },
    invalidUser: {
        error: 'invalid_user',
        description: 'Invalid user for refresh token',
        status: HttpCode.unautorized
    }
};
