import { ApiConfig, AxiosGsspProps, ClientApiMethods, ClientSideRequestProps, MethodProps, ServerApiMethods } from "./types";
import { ApiClientResourcesProps } from "./types";
import axios, { AxiosInstance } from "axios";

import useServiceCall from "./useServiceCall";
import http from "./http";

export interface ApiEndpoint<ArgsProps = unknown, DataProps = unknown> {
    readonly url: string;
    readonly method: MethodProps;
    readonly ARGS_PROPS?: ArgsProps;
    readonly DATA_PROPS?: DataProps;
    readonly serverSideResources?: {
        readonly disabledServerSideRequest?: boolean
    };
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
            const response = await http.client(axiosConfig, axiosInstance)[method](url, { params });
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

type FilteredServerApi<T> = {
    [K in keyof T as T[K] extends { serverSideResources?: { disabledServerSideRequest?: true } } ? (
        T[K]['serverSideResources'] extends { disabledServerSideRequest: true } ? never : K
    ) : K]: T[K];
};

type FilteredClientApi<T> = {
    [K in keyof T as T[K] extends { clientSideResources?: { disabledClientSideRequest?: true } } ? (
        T[K]['clientSideResources'] extends { disabledClientSideRequest: true } ? never : K
    ) : K]: T[K];
};
  
function filterServerSideEndpoints<T extends ApiConfig>(list: T): FilteredServerApi<T> {
    const filtered = Object.fromEntries(
        Object.entries(list).filter(([_, value]) => {
            return !('serverSideResources' in value && value.serverSideResources?.disabledServerSideRequest === true);
        })
    );
    
    return filtered as FilteredServerApi<T>;
}

function filterClientSideEndpoints<T extends ApiConfig>(list: T): FilteredClientApi<T> {
    const filtered = Object.fromEntries(
        Object.entries(list).filter(([_, value]) => {
            return !('disabledClientSideRequest' in value && value.clientSideResources?.disabledClientSideRequest === true);
        })
    );

    return filtered as FilteredClientApi<T>;
}

interface ObjectFactoryParamsProps<T> {
    api: T,
    axiosConfig?: AxiosGsspProps,
    axiosInstance?: AxiosInstance
}

function createCaucolum<T extends ApiConfig>({ api, axiosConfig, axiosInstance }: ObjectFactoryParamsProps<T>) {
    const UsedAxiosInstance = axiosInstance ? axiosInstance : axios.create({
        headers: {
            "Content-Type": "application/json",
        }
    });
    
    const serverFilteredList = filterServerSideEndpoints(api);
    const PrimitiveServer = createApiClass(serverFilteredList, axiosConfig, UsedAxiosInstance);

    //@ts-ignore
    const server: ServerApiMethods<typeof serverFilteredList> = new PrimitiveServer();

    const clientFilteredList = filterClientSideEndpoints(api);
    const ClientPrimitiveServer = createApiClass(clientFilteredList, axiosConfig, UsedAxiosInstance);

    //@ts-ignore
    const serverClient: ServerApiMethods<typeof clientFilteredList> = new ClientPrimitiveServer();
    const PrimitiveClient = createPrimitiveClient(serverClient, clientFilteredList);
    const client: ClientApiMethods<typeof clientFilteredList> = new PrimitiveClient();

    return {
        server,
        client
    };
}

export {
    createCaucolum
}