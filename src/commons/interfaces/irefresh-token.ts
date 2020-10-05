export interface IRefreshToken {
    id?: string;
    refresh_token: string,
    expires_in: number;
    user_id: string;
    state: boolean;
    created: number;
}
