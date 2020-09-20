import { IFirabaseSecret } from "../models/ifirebase-secret";

export class Helper {
    public static fs = require('fs');
    public static privateKey(url: string): string {
        try {
            if (process.env.JWT_PRIVATE_KEY) {
                return process.env.JWT_PRIVATE_KEY;
            }
            return  this.fs.readFileSync(url, 'utf8'); 
        } catch (error) {
            console.log('=====>', error);
        }
      }

      public static firebaseLogin(url: string) {
        if (this.fs.existsSync(url)) {
            return  JSON.parse(this.fs.readFileSync(url, 'utf8'));
        }
        const fileSecret: IFirabaseSecret = {            
            type: 'service_account',
            project_id: process.env.PROJECT_ID,
            private_key_id: process.env.PRIVATE_KEY_ID,
            private_key: process.env.PRIVATE_KEY,
            client_email: process.env.CLIENT_EMAIL,
            client_id: process.env.CLIENT_ID,
            auth_uri: process.env.AUTH_URI,
            token_uri: process.env.TOKEN_URI,
            auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
            client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
          };
          return fileSecret;
      }


}