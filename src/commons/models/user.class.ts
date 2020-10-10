import { DateHelper } from "../helpers/date-helper";
import { ISocialProvider } from "../interfaces/isocial-provider";
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

    public static async findByProvider(userProvider: ISocialProvider): Promise<IUser> {
        try {
            let user: IUser = null;
            return  await this.collection()
                    .where('accounInformation.id','==', userProvider.user.id)
                    .where('accounInformation.provider', '==', userProvider.provider)
                    .get()
                    .then((query) => {
                    if (!query.empty) {
                        const doc = query.docs[0];
                        user = {
                            id: doc.id,
                            email: doc.data().email,
                            name: doc.data().name,
                            lastName: doc.data().lastName
                            };
                        }
                        return user;
                    });
        } catch (error) {
            throw new Error(error);
        }
    }

    public static async create(user: IUser): Promise<boolean> {
        try {
            user.state = true;
            user.created = DateHelper.current().getTime();
            user.updated = DateHelper.current().getTime();
            user.accounInformation.profileImage = user.accounInformation.profileImage || null;
            user.password = user.password || null;
            user.id = user.id || null;
            await this.collection().doc().create(user);
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }
}
