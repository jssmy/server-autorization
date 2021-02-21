import { IGenericError } from "../interfaces/igeneric-error";
import { IGenericResponse } from "../interfaces/igeneric-response";
import { IGenericSuccess } from "../interfaces/igeneric-success";

export class ErrorApplication {
    status: number;
    body: IGenericError;
    
    constructor(erros: string[], status: number = 501) {
        this.status = status;
        this.body = {
            error: 'error_request',
            error_description: erros[0]
        };
        
    }
}