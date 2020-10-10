import { AuthMessagesType, OauthMessages } from "../constants/oauth.messges";
import { HttpCode } from "../emuns/http-code.enum";
import { IGenericResponse } from "../interfaces/igeneric-response";
import { IGenericSuccess } from "../interfaces/igeneric-success";
interface IOAuthMessage {
    message: string;
    description: string;
    status: number;
}


export class AuthMessageHelper {
    private static get(type: AuthMessagesType): IOAuthMessage {
        const error: IOAuthMessage = OauthMessages[type];
        return error;
    }

    public static generic(type: AuthMessagesType): IGenericResponse {
        const message = this.get(type);
        const success: IGenericSuccess  = {
            message: message.message,
            message_description: message.description
        };

        const generic: IGenericResponse = {
            status: message.status,
            body: success
        };

        return generic;
    }

    public static set(body: any) {
        const generic: IGenericResponse = {
            status: HttpCode.success,
            body: body
        };
        return generic;
    }
}