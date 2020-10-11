export interface IUser {
    id?: string;
    email: string;
    password?: string;
    name: string;
    lastName: string;
    state?: boolean;
    accounInformation?: IAccountInformation;
    created?: number;
    updated?: number;
}

interface IAccountInformation {
    profileImage?: string;
    coverImage?: string;
    id?: string;
    provider?: string;
}
