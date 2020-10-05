import { IRefreshToken } from "../interfaces/irefresh-token";
import { Model } from "./model.class";

export class RefreshToken extends Model {
    protected static collectionName = 'refresh_token';

    public static async create(refres: IRefreshToken) {
        try {
            await this.collection().doc().create(refres);
        } catch (error) {
            throw new Error(error);
        }
    }

    public static async find(refresh: string): Promise<IRefreshToken> {
        try {
            return await this.collection().where('refresh_token', '==', refresh)
                .limit(1)
                .get().then(query => {
                    if (query.empty) {
                        return null;
                    }
                    const refresTokenDoc  = query.docs[0];

                    if(!refresTokenDoc.data().state) {
                        return null;
                    }
                    const refreshToken: IRefreshToken = {
                        created: refresTokenDoc.data().created,
                        expires_in: refresTokenDoc.data().expires_in,
                        refresh_token: refresTokenDoc.data().refresh_token,
                        state: refresTokenDoc.data().state,
                        user_id: refresTokenDoc.data().user_id,
                        id: refresTokenDoc.id
                    };
                    return refreshToken;
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    public static async disable(refreshToken: IRefreshToken): Promise<boolean> {
        try {
            const updated: IRefreshToken = {
                created: refreshToken.created,
                expires_in: refreshToken.expires_in,
                refresh_token: refreshToken.refresh_token,
                state: false,
                user_id: refreshToken.user_id,
            };
            await this.collection().doc(refreshToken.id).update(updated);
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }
}
