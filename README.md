```md
# Next Client Architecture

**Api-query-object** is a JavaScript library that quickly and automatically creates HTTP requests, aligning with a client-server architecture.

## ✨ Features

With **api-query-object**, you can list your endpoints and automatically generate:

- **`server` object**: A class whose methods are used on the server side, such as in `getServerSideProps` and `getStaticProps`.
- **`client` object**: A class with the same methods as the server, but with embedded business logic for use in pages and components. These objects include:
  - `makeRequest`: A function to trigger the client request.
  - `data`: The response of the request.
  - `args`: The parameters of the last request.
  - `status`: Represents the current state of the request.  
    Possible values:
    - `'idle'`: No request has been made yet.
    - `'loading'`: A request is currently in progress.
    - `'loaded'`: The request completed successfully.
    - `'error'`: The request failed due to an error.

---

## 📦 Installation

```bash
npm i @caucolum/api-query-object
```

---

## ⚙️ Folder Structure

The generated `api-query-objects` folder contains files for managing API queries:

- `api.ts`: Stores the list of available API endpoints used in the project.
- `factory.ts`: Responsible for creating and returning objects that represent specific API query configurations.

```
📁 my-project
├── 📁 src 
│   └── 📁 api-query-objects
│       ├── 📄 api.ts
│       └── 📄 factory.ts
```

---

## 📌 Define Endpoints

In `api.ts`, define your API endpoints:

```ts
import { ApiEndpoint } from "@caucolum/api-query-object";

const api = {

} as const satisfies Record<string, ApiEndpoint>;

export default api;
```

Then, generate the architecture objects:

```ts
import { createServerNextArchitecture, createClientNextArchitecture } from "@caucolum/api-query-object";
import api from "./api";

const serverQueriesObject = createServerNextArchitecture(api);
const clientQueriesObject = createClientNextArchitecture(serverQueriesObject, api);

export {
  serverQueriesObject,
  clientQueriesObject
};
```

Example with endpoints:

```ts
import { ApiEndpoint } from "@caucolum/api-query-object";

interface BreedsImageRandomArgProps {
  breed?: string;
}

interface BreedsImageRandomDataProps {
  message: string;
  status: string;
}

interface BreedsHoundImagesDataProps {
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
    DATA_PROPS: {} as BreedsHoundImagesDataProps,
  },
} as const satisfies Record<string, ApiEndpoint>;

export default api;
```

---

## 📡 Server-Side Usage (`getServerSideProps`)

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

---

## 🧩 Client-Side Usage (React Component)

```tsx
import { clientQueriesObject } from "@/services/api-query-objects";

interface PageProps {
  listByBreed: string[];
}

const Index = ({ listByBreed }: PageProps) => {
  const { makeRequest, data, status } = clientQueriesObject.breeds_image_random();
  const isSuccess = status === 'loaded';

  return (
    <div>
      <div>
        {isSuccess && <img src={data.message} alt="Dog" />}
        <button onClick={() => makeRequest()}>New request</button>
      </div>
      <div className="h-50 overflow-y-scroll">
        {listByBreed.map((breed, index) => (
          <div key={index}>{breed}</div>
        ))}
      </div>
    </div>
  );
};

export default Index;
```

---

## 🧪 License

MIT © [Caucolum](https://github.com/caucolum)
```
