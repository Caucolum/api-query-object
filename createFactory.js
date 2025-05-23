import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..', '..', '..');
const dirPath = path.join(projectRoot, 'src', 'api-query-objects');
const filePath = path.join(dirPath, 'factory.ts');

const content = `
import { createServerNextArchitecture, createClientNextArchitecture } from "@caucolum/api-query-object";
import { axiosConfig, axiosInstance } from "./axios";

import api from "./api";

const caucolumServer = createServerNextArchitecture(api, axiosConfig, axiosInstance);
const caucolumClient = createClientNextArchitecture(caucolumServer, api);

export {
    caucolumServer,
    caucolumClient
}
`;

if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');