import { DateHelper } from "../helpers/date-helper";
import { ISocialProvider } from "../interfaces/isocial-provider";
import { IUser } from "../interfaces/iuser";
import { Model } from "./model.class";
const crypto = require('crypto');
export class User  extends Model{
    protected static collectionName = 'users';
    
    public static async findByCredential(email: string, password: string): Promise<IUser> {
                let user: IUser = null;
                try {
                    await User.collection()
                        .where('email', '==', email)
                        .where('password', '==', password)
                        .where('state', '==', true)
                        .limit(1)
                        .get().then(query => {
                            if (!query.empty) {
                                const doc = query.docs[0];
                                user = {
                                    id: doc.id,
                                    email: doc.data().email,
                                    fullName: doc.data().fullName,
                                    accounInformation: {
                                        id: doc.data().id,
                                        provider: doc.data().provider,
                                        coverImage: doc.data().coverImage,
                                        profileImage: doc.data().accounInformation.profileImage,
                                    },
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
                    fullName: userDoc.fullName,
                    id: query.id,
                    accounInformation: {
                        coverImage: userDoc.coverImage,
                        id: userDoc.id,
                        provider: userDoc.provider,
                        profileImage: userDoc.accounInformation.profileImage
                    }
                };
                
                return user;
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    public static async findByProvider(userProvider: IUser): Promise<IUser> {
        try {
            let user: IUser = null;
            return  await this.collection()
                    .where('accounInformation.id','==', userProvider.accounInformation.id)
                    .where('accounInformation.provider', '==', userProvider.accounInformation.provider)
                    .get()
                    .then((query) => {
                    if (!query.empty) {
                        const doc = query.docs[0];
                        user = {
                            id: doc.id,
                            email: doc.data().email,
                            fullName: doc.data().fullName,
                            accounInformation: {
                                coverImage: doc.data().coverImage,
                                id: doc.data().id,
                                provider: doc.data().provider,
                                profileImage: doc.data().accounInformation.profileImage,
                            }
                            };
                        }
                        return user;
                    });
        } catch (error) {
            throw new Error(error);
        }
    }

    public static async create(user: IUser): Promise<IUser> {
        try {
            const userId = crypto.randomBytes(10).toString('hex');
            user.state = true;
            user.created = DateHelper.current().getTime();
            user.updated = DateHelper.current().getTime();
            user.accounInformation.profileImage = user.accounInformation.profileImage || null;
            user.password = user.password || null;
            user.id = user.id || null;
            await this.collection().doc(userId).create(user);
            user.id = userId;
            return user;

        } catch (error) {
            throw new Error(error);
        }
    }

    public static async findByEmail(email: string): Promise<IUser> {
        let user: IUser = null;
        try {
            return await this.collection().where('email','==', email).limit(1).get().then(query => {
                if(!query.empty) {
                    const doc = query.docs[0];
                    user = {
                        id: doc.id,
                        email: doc.data().email,
                        fullName: doc.data().fullName,
                        accounInformation: {
                            id: doc.data().id,
                            provider: doc.data().provider,
                            coverImage: doc.data().coverImage,
                            profileImage: doc.data().accounInformation.profileImage,
                        },
                    };
                }
                return user;
            });
        } catch(error) {

        }
    }
}
