# Api Query Object

Api-query-object is a JavaScript library that quickly and automatically creates HTTP requests, aligning with the client-server architecture.

## Features

With Api-query-object, the user can list their endpoints, automatically generating:

- **`caucolumServer` object**: A class object whose methods are used on the server side, such as in `getServerSideProps` and `getStaticProps`.
- **`caucolumClient` object**: A class object with the same methods as server, but with embedded business logic, for use on pages and components. These objects include:
  - `makeRequest`: A usable function to trigger the client request.
  - `data`: The response of the request.
  - `args`: Parameters of the last request.
  - `status`: Represents the current state of the request.  
    It can be one of the following values:
    - `idle`: No request has been made yet.
    - `loading`: A request is currently in progress.
    - `loaded`: The request was completed successfully.
    - `error`: The request failed due to an error.

## Usage Example

### 1. Install library: 

```ts
npm i @caucolum/api-query-object
```

### 2. Created files

The created folder api-query-objects contains files for managing API queries.

`api.ts`: This file stores a list of available API endpoints used in the project.
`axios.ts`: This file defines the configuration used for making HTTP requests with Axios.
`factory.ts`: This file is responsible for creating and returning objects that represent specific API query configurations.

```txt
📁 my-project
├── 📁 src 
    └── 📁 api-query-objects
        └── 📄 api.ts
        └── 📄 axios.ts
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
import { axiosConfig, axiosInstance } from "./axios";
import api from "./api";

const caucolumServer = createServerNextArchitecture(api, axiosConfig, axiosInstance);
const caucolumClient = createClientNextArchitecture(api, axiosConfig, axiosInstance);

export {
    caucolumServer,
    caucolumClient
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
import { caucolumServer } from "@/api-query-objects";

export const getServerSideProps = async () => {
    const response = await caucolumServer.breed_hound_images();
    return {
        props: {
            listByBreed: response.message
        },
    };
};

interface PageProps {
    listByBreed: string[];
}

const Index = ({ listByBreed }: PageProps) => {
    return <div>
        <div className="h-50 overflow-y-scroll">
            {listByBreed.map((breed, index) => (
                <div key={index}>{breed}</div>
            ))}
        </div>
    </div>
};

export default Index;
```

### 5. Client-Side Usage (React Component)

```tsx
import { caucolumClient } from "@/api-query-objects";

const Index = () => {
    const { makeRequest, data, isSuccess } = caucolumClient.breeds_image_random();
    return <div>
        <div>
            {isSuccess && <img src={data.message} alt="" />}
            <button onClick={() => makeRequest()}>New request</button>
        </div>
    </div>
};

export default Index;
```

## Features

HTTP requests have required attributes and other customizable features.

Required attributes:

- **`url`** the endpoint of the request.
- **`method`** the HTTP method of the request. Them are:
  - `get` `post` `put` `delete`

Customizable features:
- **`DATA_PROPS`** interface for the response object.
- **`ARGS_PROPS`** interface for the request parameters object.
- **`serverSideResources`** resources for requests on server side:
  - `disabledServerSideRequest` determines whether the request should be made on the server side.
- **`clientSideResources`** resources for requests on client side:
  - `disabledClientSideRequest` determines whether the request should be made on the client side.
  - `onSuccess` function that defines the behavior after a successful request.
  - `onError` function that defines the behavior in case of an error.

### 1. Server-side example: 

```ts
interface UserProps {
    email: string,
    name: string,
    id: string,
}
 
getUser: {
    url: '/auth/user',
    method: 'get',
    DATA_PROPS: {} as UserProps,
    clientSideResources: {
        disabledClientSideRequest: true
    },
    serverSideResources: {
        disabledServerSideRequest: false
    }
}
 ```
Note that the `getUser` request will be used only on the server side, so it won't be exposed in the `caucolumClient` object.

### 2. Client-side example: 

```ts
login: {
    url: '/auth/login',
    method: 'post',
    ARGS_PROPS: {} as PostLoginParamsProps,
    DATA_PROPS: {} as PostLoginResponse,
    clientSideResources: {
        disabledClientSideRequest: false,
        async onSuccess({ data, redirector }) {
            const token = data.token as string;
            const id = data.id as string;

            setCookie(null, "token", token, {
                path: "/",
                maxAge: 30 * 24 * 60 * 60,
            });

            setCookie(null, "id", id, {
                path: "/",
                maxAge: 30 * 24 * 60 * 60,
            });

            redirector(`/mainly/page`);
        },
    },
    serverSideResources: {
        disabledServerSideRequest: true,
    }
}
```
The login request will be handled only on the client side. Below are the specific resources:
- **`onSuccess`** function than contains a callback:
  - `data` the response from the request.
  - `redirector` used to redirect to another page.
    
Note: `data` can be used to trigger actions before redirecting to another page.
