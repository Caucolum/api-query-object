import { ApiConfig, ClientApiMethods, MethodProps, ServerApiMethods } from "./types";
import { ApiClientResourcesProps } from "./types";

import useServiceCall from "./useServiceCall";
import http from "./http";

export interface ApiEndpoint<ArgsProps = unknown, DataProps = unknown> {
    readonly url: string;
    readonly method: MethodProps;
    readonly authenticated: boolean;
    readonly ARGS_PROPS?: ArgsProps;
    readonly DATA_PROPS?: DataProps;
}

function createApiClass<T extends ApiConfig>(list: T) {
    return class Api {
        constructor() {
            Object.keys(list).forEach((key) => {
                (this as any)[key] = async (params?: any) => {
                    return this.request(list[key].method, list[key].url, list[key].authenticated);
                };
            });
        }
    
        async request(method: MethodProps, url: string, authenticated?: boolean): Promise<any> {
            const client = authenticated ? http.privateClient() : http.publicClient();
            const response = await client[method](url);
            return response.data;
        }
    };
}

function createPrimitiveClient<T extends ServerApiMethods<any>>(serverApi: T) {
    const client: Partial<Record<keyof T, () => ReturnType<typeof useServiceCall>>> = {};
  
    for (const key in serverApi) {
      client[key] = () => {
        return useServiceCall({ fn: serverApi[key] });
      };
    }
  
    return client as { [K in keyof T]: () => ReturnType<typeof useServiceCall> };
  }
  

function createServerNextArchitecture<T extends ApiConfig>(list: T) {
    const PrimitiveServer = createApiClass(list);
    //@ts-ignore
    const server: ServerApiMethods<typeof list> = new PrimitiveServer();
    return server;
}

function createClientNextArchitecture<T extends ServerApiMethods<any>, K extends ApiConfig>(serverApi: T, list: K) {
    const client: ClientApiMethods<typeof list> = createPrimitiveClient(serverApi);
    return client;
}

export {
    createServerNextArchitecture,
    createClientNextArchitecture,
}