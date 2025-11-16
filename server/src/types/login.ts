export interface LoginRequestBody{
    type: string;
    email: string;
    password: string;
    refreshToken?: string;

}