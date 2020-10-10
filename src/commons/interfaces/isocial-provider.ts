export interface ISocialProvider {
    provider: string;
    user: IUserProvider;
}

interface IUserProvider {
    id?: string;
    provider: string;
    profileImage: string;
    email: string;
    name: string;
    lastName: string;
}

