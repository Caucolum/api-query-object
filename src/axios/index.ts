import { AxiosInstance, AxiosRequestConfig } from "axios";

interface CreateConfiguredAxiosInstanceProps {
    gssp: any,
    axiosInstance: AxiosInstance
}

export const createConfiguredAxiosInstance = ({ gssp, axiosInstance }: CreateConfiguredAxiosInstanceProps) => {
    axiosInstance.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            if (gssp) {
                const userConfig = gssp(config);
                return userConfig;
            }

            return config;
        }, 
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return axiosInstance;
}