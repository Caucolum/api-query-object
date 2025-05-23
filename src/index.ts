import { ApiConfig, ClientApiMethods, ClientSideRequestProps, MethodProps, ServerApiMethods, ServerSideProps } from "./types";
import { ApiClientResourcesProps } from "./types";
import { AxiosInstance } from "axios";

import useServiceCall from "./useServiceCall";
import http from "./http";

export interface ApiEndpoint<ArgsProps = unknown, DataProps = unknown> {
    readonly url: string;
    readonly method: MethodProps;
    readonly ARGS_PROPS?: ArgsProps;
    readonly DATA_PROPS?: DataProps;
    readonly serverSideResources?: ServerSideProps;
    readonly clientSideResources?: ClientSideRequestProps;
}

function createApiClass<T extends ApiConfig>(list: T, axiosConfig: any, axiosInstance: AxiosInstance) {
    return class Api {
        constructor() {
            Object.keys(list).forEach((key) => {
                (this as any)[key] = async (params?: any) => {
                    return this.request(list[key].method, list[key].url, params);
                };
            });
        }
    
        async request(method: MethodProps, url: string, params?: any): Promise<any> {
            const client = http.client(axiosConfig, axiosInstance);
            const response = await client[method](url, { params });
            return response.data;
        }
    };
}

function createPrimitiveClient<T extends ServerApiMethods<any>, K extends ApiConfig>(serverApi: T, list: K): new () => { [K in keyof T]: () => any } {
    class PrimitiveClient {
        constructor() {
            Object.keys(serverApi).forEach((key) => {
                const resources = list[key as keyof K]?.clientSideResources;
                (this as any)[key] = () => {
                    return useServiceCall({ fn: serverApi[key as keyof T], resources }) as ApiClientResourcesProps; 
                };
            });
        }
    }

    return PrimitiveClient as new () => { [K in keyof T]: () => any };
}

function createServerNextArchitecture<T extends ApiConfig>(list: T, axiosConfig: any, axiosInstance: AxiosInstance) {
    const PrimitiveServer = createApiClass(list, axiosConfig, axiosInstance);
    //@ts-ignore
    const server: ServerApiMethods<typeof list> = new PrimitiveServer();
    return server;
}

function createClientNextArchitecture<T extends ServerApiMethods<any>, K extends ApiConfig>(serverApi: T, list: K) {
    const PrimitiveClient = createPrimitiveClient(serverApi, list);
    const client: ClientApiMethods<typeof list> = new PrimitiveClient();
    return client;
}

export {
    createServerNextArchitecture,
    createClientNextArchitecture,
}