import { IUser } from "../interfaces/iuser";
import { Model } from "./model.class";

export class User  extends Model{
    protected static collectionName = 'users';
    
    public static async findByCredential(email: string, password: string): Promise<IUser> {
                let user: IUser = null;
                try {
                    await User.collection()
                        .where('email', '==', email)
                        .where('password', '==', password)
                        .where('state', '==', true)
                        .select('name', 'email','lastName')
                        .limit(1)
                        .get().then(query => {
                            if (!query.empty) {
                                const doc = query.docs[0];
                                user = {
                                    id: doc.id,
                                    email: doc.data().email,
                                    name: doc.data().name,
                                    lastName: doc.data().lastName
                                };
                            }
                        })
                        return user;
                } catch (error) {
                    throw new Error(error);
                }
    }

    public static async find(id: string): Promise<IUser> {
        try {
            return await this.collection().doc(id).get().then(query => {
                if(!query.exists) {
                    return null;
                }
                
                const userDoc = query.data();
                
                if(!userDoc.state) {
                    return null;
                }
                
                const user: IUser = {
                    email: userDoc.email,
                    lastName: userDoc.lastName,
                    name: userDoc.name,
                    id: query.id,
                };
                
                return user;
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}
