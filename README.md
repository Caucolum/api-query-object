# Next Client Architecture

Api-query-object is a JavaScript library that quickly and automatically creates HTTP requests, aligning with the client-server architecture.

## Features

With Api-query-object, the user can list their endpoints, automatically generating:

- **`server` object**: A class object whose methods are used on the server side, such as in `getServerSideProps` and `getStaticProps`.
- **`client` object**: A class object with the same methods as server, but with embedded business logic, for use on pages and components. These objects include:
  - `makeRequest`: A usable function to trigger the client request.
  - `data`: The response of the request.
  - `args`: Parameters of the last request.
  - `status`: Represents the current state of the request.  
    It can be one of the following values:
    - `'idle'`: No request has been made yet.
    - `'loading'`: A request is currently in progress.
    - `'loaded'`: The request was completed successfully.
    - `'error'`: The request failed due to an error.

## Usage Example

### 1. Install library: 

```ts
npm i @caucolum/api-query-object
```

### 2. Created files

The created folder api-query-objects contains files for managing API queries.

`api.ts`: This file stores a list of available API endpoints used in the project.
`factory.ts`: This file is responsible for creating and returning objects that represent specific API query configurations.

```txt
📁 meu-projeto
├── 📁 src 
    └── 📁 api-query-objects
        └── 📄 api.ts
        └── 📄 factory.ts
```

### 3. Define Endpoints

In `api.ts`, user can implements him api endpoints: 

```ts
import { ApiEndpoint } from "@caucolum/api-query-object";

const api = {

} as const satisfies Record<string, ApiEndpoint>;

export default api;
```

The objects are automatically created when implementing the user api endpoints:

```ts
import { createServerNextArchitecture, createClientNextArchitecture } from "@caucolum/api-query-object";
import api from "./api";

const serverQueriesObject = createServerNextArchitecture(api);
const clientQueriesObject = createClientNextArchitecture(serverQueriesObject, api);

export {
    serverQueriesObject,
    clientQueriesObject
}
```

Now just include your own API in `api.ts`:

```ts
import { ApiEndpoint } from "@caucolum/api-query-object";

interface BreedsImageRandomArgProps {
    breed?: string;
}

interface BreedsImageRandomDataProps {
    message: string;
    status: string;
}

interface BreedsHoudImagesDataProps {
    message: string[];
    status: string;
}

const api = {
    breeds_image_random: {
        url: '/breeds/image/random',
        method: 'get',
        authenticated: false,
        ARGS_PROPS: {} as BreedsImageRandomArgProps,
        DATA_PROPS: {} as BreedsImageRandomDataProps,
    },
    breed_hound_images: {
        url: '/breed/hound/images',
        method: 'get',
        authenticated: false,
        DATA_PROPS: {} as BreedsHoudImagesDataProps,
    },
} as const satisfies Record<string, ApiEndpoint>;

export default api;
```

### 4. Server-Side Usage (`getServerSideProps`)

```ts
import { serverQueriesObject } from "@/api-query-objects";

export const getServerSideProps = async () => {
    const response = await serverQueriesObject.breed_hound_images();
    return {
        props: {
            listByBreed: response.message
        },
    };
};
```

### 5. Client-Side Usage (React Component)

```tsx
import { clientQueriesObject } from "@/services/api-query-objects";

interface PageProps {
    listByBreed: string[];
}

const Index = ({ listByBreed }: PageProps) => {
    const { makeRequest, data, isSuccess } = clientQueriesObject.breeds_image_random();
    return <div>
        <div>
            {isSuccess && <img src={data.message} alt="" />}
            <button onClick={() => makeRequest()}>New request</button>
        </div>
        <div className="h-50 overflow-y-scroll">
            {listByBreed.map((breed, index) => (
                <div key={index}>{breed}</div>
            ))}
        </div>
    </div>
};

export default Index;
```