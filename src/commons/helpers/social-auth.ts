import { environment } from "../environment/environment";
import { IGenericResponse } from "../interfaces/igeneric-response";
import fetch from 'node-fetch';
import { HttpCode } from "../emuns/http-code.enum";

export class SocialAuth {
    public static async google(idToken: string): Promise<IGenericResponse> {
        try {
            const generic: IGenericResponse = {
                status: HttpCode.unautorized,
                body: 'error'
            };
            return await fetch(`${environment.google_valid_access_token}/tokeninfo?id_token=${idToken}}`).then((res) => {
                if (res.status === 200) {
                    generic.status = 200;
                    generic.body = 'success';
                    return generic;
                }    
                return generic;
                
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    public static async facebook(accessToken: string) {
        try {
            const generic: IGenericResponse = {
                status: HttpCode.unautorized,
                body: 'error'
            }
            return await fetch(`${environment.facebook_valid_access_token}/me?access_token=${accessToken}`).then((response) => {
                console.log('facebook =>>>',response);
            });
        } catch (error) {
            
        }
    }
}