import { createConfiguredAxiosInstance } from "../axios";
import { AxiosInstance } from "axios";

class Http {
    public publicClient() {
        return createConfiguredAxiosInstance({
            url: '',
            withBearerToken: false,
        }) as AxiosInstance;
    }
  
    public privateClient() {
        return createConfiguredAxiosInstance({
            url: '',
            withBearerToken: true,
        }) as AxiosInstance;
    }
}

const http = new Http();
export default http;