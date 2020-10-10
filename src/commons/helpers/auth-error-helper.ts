import { AuthErrorTypes, OauthError } from "../constants/oauth.errors";
import { IGenericError } from "../interfaces/igeneric-error";
import { IGenericResponse } from "../interfaces/igeneric-response";
interface IOAuthError {
    error: string;
    description: string;
    status: number;
}
export class AuthErrorHelper {
    private static get(type: AuthErrorTypes): IOAuthError {
        const error: IOAuthError = OauthError[type];
        return error;
    }

    public static generic(type: AuthErrorTypes): IGenericResponse
    {
        const error = this.get(type)
        const genericError: IGenericError = {
            error: error.error,
            error_description: error.description
        };
        const generic: IGenericResponse = {
            status:  error.status,
            body: genericError
        };
        return generic;
    }
}
