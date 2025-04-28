import { AxiosInstance } from 'axios';

type UseServiceCallStatusProps = 'idle' | 'loading' | 'loaded' | 'error';
type MethodProps = 'get' | 'post' | 'put' | 'delete';
type ApiConfig = {
    [key: string]: {
        url: string;
        method: MethodProps;
        authenticated: boolean;
        ARGS_PROPS?: unknown;
        DATA_PROPS?: unknown;
        ERROR_PROPS?: unknown;
        redirector?: string;
    };
};
interface ApiClientResourcesProps<T = any, K = any, M = any> {
    makeRequest: (props?: K) => void;
    status: UseServiceCallStatusProps;
    error: M;
    data: T;
    args: K;
}
type ServerApiMethods<T extends ApiConfig> = {
    [K in keyof T]: (params?: T[K]['ARGS_PROPS']) => Promise<T[K]['DATA_PROPS']>;
};
type ClientApiMethods<T extends ApiConfig> = {
    [K in keyof T]: (params?: any) => ApiClientResourcesProps<T[K]["DATA_PROPS"], T[K]["ARGS_PROPS"], T[K]["ERROR_PROPS"]>;
};

interface ApiEndpoint<ArgsProps = unknown, DataProps = unknown> {
    readonly url: string;
    readonly method: MethodProps;
    readonly authenticated: boolean;
    readonly ARGS_PROPS?: ArgsProps;
    readonly DATA_PROPS?: DataProps;
    readonly redirector?: string;
}
declare function createServerNextArchitecture<T extends ApiConfig>(list: T, axiosConfig: any, axiosInstance: AxiosInstance): ServerApiMethods<T>;
declare function createClientNextArchitecture<T extends ServerApiMethods<any>, K extends ApiConfig>(serverApi: T, list: K): ClientApiMethods<K>;

export { type ApiEndpoint, createClientNextArchitecture, createServerNextArchitecture };
