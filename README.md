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

### 1. Define Endpoints

The API object is automatically created when implementing the library:

```ts
import { createServerNextArchitecture, ApiEndpoint } from "@caucolum/api-query-object";

const api = {

} as const satisfies Record<string, ApiEndpoint>;

const serverQueriesObject = createServerNextArchitecture(api);

export {
    serverQueriesObject
}
```
Now just include your own API:

```ts
import { createServerNextArchitecture, ApiEndpoint } from "@caucolum/api-query-object";

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

const serverQueriesObject = createServerNextArchitecture(api);
const clientQueriesObject = createClientNextArchitecture(serverQueriesObject, api);

export {
    serverQueriesObject,
    clientQueriesObject
}
```

### 2. Server-Side Usage (`getServerSideProps`)

```ts
import { serverQueriesObject } from "@/api";

export const getServerSideProps = async () => {
    const response = await serverQueriesObject.breed_hound_images();
    return {
        props: {
            listByBreed: response.message
        },
    };
};
```

### 3. Client-Side Usage (React Component)

```tsx
import { clientQueriesObject } from "@/services/api";

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