# Api Query Object

Api-query-object is a JavaScript library that quickly and automatically creates HTTP requests, aligning with the client-server architecture.

## Features

With `api-query-object`, the user can list their endpoints, automatically generating:

- **`server` object**: A class object whose methods are used on the server side, such as in `getServerSideProps` and `getStaticProps`.
- **`client` object**: A class object with the same methods as server, but with embedded business logic, for use on pages and components. These objects include:
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

### 2. Create files

The library exports the `createCaucolum` method. Its parameters are:

- **`api`**: a list of requests defined by the user.
- **`axiosConfig?`**: an optional Axios configuration object. The `api-query-object` provides a default configuration if the user chooses not to define their own.
- **`axiosInstance?`**: an optional custom Axios instance for making requests. A default instance is provided, but the user may supply their own if desired.

### 3. Define Endpoints

Create a `.ts` file in your project and use createCaucolum method as follows:

```ts

const caucolum = createCaucolum({
    api: {
       
    },
});

export default caucolum;
```

The objects are automatically created when implementing the api endpoints.

Now just include your own API in api file:

```ts
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

const caucolum = createCaucolum({
    api: {
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
    }
});

export default caucolum;
```

### 4. Server-Side Usage (`getServerSideProps`)

```ts
import { caucolum } from ".";

export const getServerSideProps = async () => {
    const response = await caucolum.server.breed_hound_images();

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
import { caucolum } from ".";

const Index = () => {
    const { makeRequest, data, isSuccess } = caucolum.client.breeds_image_random();

    return <div>
        <div>
            {isSuccess && <img src={data.message} alt="" />}
            <button onClick={() => makeRequest()}>New request</button>
        </div>
    </div>
};

export default Index;
```

### 6. Request config

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

#### 1. Server-side example: 

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

#### 2. Client-side example: 

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

## Instance and configuration

As mentioned earlier, `api-query-object` provides a default configuration and request instance, but the user can customize them if needed.

```ts
const caucolum = createCaucolum({
    api: {
    
    },
    axiosConfig: (config: AxiosRequestConfig): AxiosRequestConfig => {
    
        return config;
    },
    axiosInstance: axios.create({
      
    })
    
});
```

### 1. axios config: 

The user can use it to add custom configurations to the request.

```ts
const caucolum = createCaucolum({
    api: {
    
    },
    axiosConfig: (config: AxiosRequestConfig): AxiosRequestConfig => {
        const { token } = parseCookies();
    
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    
        return config;
    },
});
```
Here user creates a axiosConfig passing an authorization token in the headers.

### 2. axios instance:

The user can use this to create a custom Axios instance that will be used for the requests:

```ts
const caucolum = createCaucolum({
    api: {
    
    },
    axiosInstance: axios.create({
        baseURL: "user/api",
        headers: {
            "Content-Type": "application/json",
        }
    })
});
```
