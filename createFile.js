import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..', '..', '..');
const dirPath = path.join(projectRoot, 'src', 'api-query-objects');
const filePath = path.join(dirPath, 'index.ts');

const content = `
import { createServerNextArchitecture, createClientNextArchitecture, ApiEndpoint } from "@caucolum/api-query-object";

export interface BreedsImageRandomDataProps {
    message: string;
    status: string;
}

export interface BreedHoundImagesDataProps {
    message: string[];
    status: string;
}

const api = {
    breeds_image_random: {
        url: "https://dog.ceo/api/breeds/image/random",
        authenticated: false,
        method: 'get',
        DATA_PROPS: {} as BreedsImageRandomDataProps,
    },
    breed_hound_images: {
        url: "https://dog.ceo/api/breed/hound/images",
        authenticated: false,
        method: 'get',
        DATA_PROPS: {} as BreedHoundImagesDataProps,
    },
} as const satisfies Record<string, ApiEndpoint>;

const serverQueriesObject = createServerNextArchitecture(api);
const clientQueriesObject = createClientNextArchitecture(serverQueriesObject, api);

export {
    serverQueriesObject,
    clientQueriesObject
}
`;

if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');