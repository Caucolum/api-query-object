import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..', '..', '..');
const dirPath = path.join(projectRoot, 'src', 'api-query-objects');
const filePath = path.join(dirPath, 'api.ts');

const content = `
import { ApiEndpoint } from "@caucolum/api-query-object";

const api = {
 
} as const satisfies Record<string, ApiEndpoint>;

export default api;
`;

if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');