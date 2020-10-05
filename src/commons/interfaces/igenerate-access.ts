import { IAccessToken } from "./iaccess-token";
import { IRefreshToken } from "./irefresh-token";

export interface IGenerateAccess {
    access_token: IAccessToken;
    refresh_token: IRefreshToken;
}