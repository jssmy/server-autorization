import { ErrorApplication } from "../constants/error-application";
import { ErrorMessages } from "../emuns/error-messages.enum";


export class Validate {
    private static object: any;
    private static errors: string[] = [];
    public static set(obj: any) {
        this.object = obj
        return this;
    }
    public static check(fields:string[] = []) {
        fields.forEach(field => {
            if (!this.object[field]) {
                this.errors.push(ErrorMessages.required.replace(':field', field));
            }
        });
        return this;
    }

    public static valid(): boolean {
        if (this.errors.length) {
            throw new ErrorApplication(this.errors,400);
        }
        return true;
    }
}
