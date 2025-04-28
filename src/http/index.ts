import { createConfiguredAxiosInstance } from "../axios";
import { AxiosInstance } from "axios";

class Http {
    public client(gssp: any, axiosInstance: AxiosInstance) {
        return createConfiguredAxiosInstance({
            gssp, axiosInstance
        }) as AxiosInstance;
    }
}

const http = new Http();
export default http;