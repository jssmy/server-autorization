import * as admin from 'firebase-admin';
import { Helper } from '../helpers/helpers';

const fileSecret = Helper.firebaseLogin('secret-client.json');
admin.initializeApp({
  credential: admin.credential.cert(fileSecret),
  databaseURL: "https://user-autorization.firebaseio.com"
});

export class Model {
    protected static collectionName: string = 'default'
    private static db: admin.firestore.Firestore  = admin.firestore();
    public static collection() {
        return this.db.collection(this.collectionName);
    }

    public static collectionGroup(group: string) {
      return this.db.collectionGroup(group);
    }
}
