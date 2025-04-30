import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..', '..', '..');
const dirPath = path.join(projectRoot, 'src', 'api-query-objects');
const filePath = path.join(dirPath, 'axios.ts');

const content =`
import axios, { AxiosRequestConfig } from "axios";
import { baseURL } from "./api";

const axiosConfig = (config: AxiosRequestConfig): AxiosRequestConfig => {

    return config;
}

const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    }
});

export { 
    axiosConfig,
    axiosInstance
};
`;

if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');