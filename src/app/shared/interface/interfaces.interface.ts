export interface Response<T>{
    ok: boolean;
    message: string;
    data: T;
}