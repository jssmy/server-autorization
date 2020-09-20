import * as admin from 'firebase-admin';
let file;
try {
    file = require('./../../../secret-client.json');  
} catch (error) {
    console.log('=======>',error);
}

const fileSecret: any = {
  type: 'service_account',
  project_id: process.env.PROJECT_ID || file.project_id,
  private_key_id: process.env.PRIVATE_KEY_ID || file.private_key_id,
  private_key: process.env.PRIVATE_KEY || file.private_key,
  client_email: process.env.CLIENT_EMAIL || file.client_email,
  client_id: process.env.CLIENT_ID || file.client_id,
  auth_uri: process.env.AUTH_URI || file.auth_uri,
  token_uri: process.env.TOKEN_URI || file.token_uri,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL || file.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL || file.client_x509_cert_url,
};

admin.initializeApp({
  credential: admin.credential.cert(fileSecret),
  databaseURL: "https://user-autorization.firebaseio.com"
});

export class Controller {
    protected static collectionName: string = 'default'
    private static db: admin.firestore.Firestore  = admin.firestore();
    public static collection() {
        return this.db.collection(this.collectionName);
    }
}
