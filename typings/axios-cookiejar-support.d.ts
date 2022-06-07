import type { AxiosInstance, AxiosStatic } from 'axios';
import type { CookieJar } from 'tough-cookie';
declare module 'axios' {
    interface AxiosRequestConfig {
        jar?: CookieJar;
    }
}
export declare function wrapper<T extends AxiosStatic | AxiosInstance>(axios: T): T;
