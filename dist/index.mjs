// src/useServiceCall/index.tsx
import { useState } from "react";
var useServiceCall = ({ fn, resources }) => {
  const onSuccess = resources?.onSuccess;
  const onError = resources?.onError;
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [args, setArgs] = useState(null);
  const redirector = (url) => {
    window.location.href = url;
  };
  const makeRequest = async (...args2) => {
    setStatus("loading");
    setArgs(args2);
    try {
      const response = await fn(...args2);
      setStatus("loaded");
      setData(response);
      if (onSuccess) {
        onSuccess({ data: response, redirector });
      }
    } catch (error2) {
      setStatus("error");
      setError(error2);
      if (onError) {
        onError({ error: error2, redirector });
      }
    }
  };
  return {
    data,
    status,
    error,
    args,
    makeRequest
  };
};
var useServiceCall_default = useServiceCall;

// src/axios/index.ts
var createConfiguredAxiosInstance = ({ gssp, axiosInstance }) => {
  axiosInstance.interceptors.request.use(
    (config) => {
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
};

// src/http/index.ts
var Http = class {
  client(gssp, axiosInstance) {
    return createConfiguredAxiosInstance({
      gssp,
      axiosInstance
    });
  }
};
var http = new Http();
var http_default = http;

// src/index.ts
function createApiClass(list, axiosConfig, axiosInstance) {
  return class Api {
    constructor() {
      Object.keys(list).forEach((key) => {
        this[key] = async (params) => {
          return this.request(list[key].method, list[key].url, params);
        };
      });
    }
    async request(method, url, params) {
      const client = http_default.client(axiosConfig, axiosInstance);
      const response = await client[method](url, { params });
      return response.data;
    }
  };
}
function createPrimitiveClient(serverApi, list) {
  class PrimitiveClient {
    constructor() {
      Object.keys(serverApi).forEach((key) => {
        const resources = list[key]?.clientSideResources;
        this[key] = () => {
          return useServiceCall_default({ fn: serverApi[key], resources });
        };
      });
    }
  }
  return PrimitiveClient;
}
function filterServerSideEndpoints(list) {
  const filtered = Object.fromEntries(
    Object.entries(list).filter(([_, value]) => {
      return !("serverSideResources" in value && value.serverSideResources?.disabledServerSideRequest === true);
    })
  );
  return filtered;
}
function filterClientSideEndpoints(list) {
  const filtered = Object.fromEntries(
    Object.entries(list).filter(([_, value]) => {
      return !("disabledClientSideRequest" in value && value.clientSideResources?.disabledClientSideRequest === true);
    })
  );
  return filtered;
}
function createServerNextArchitecture(list, axiosConfig, axiosInstance) {
  const filteredList = filterServerSideEndpoints(list);
  const PrimitiveServer = createApiClass(filteredList, axiosConfig, axiosInstance);
  const server = new PrimitiveServer();
  return server;
}
function createClientNextArchitecture(list, axiosConfig, axiosInstance) {
  const filteredList = filterClientSideEndpoints(list);
  const PrimitiveServer = createApiClass(filteredList, axiosConfig, axiosInstance);
  const server = new PrimitiveServer();
  const PrimitiveClient = createPrimitiveClient(server, filteredList);
  const client = new PrimitiveClient();
  return client;
}
export {
  createClientNextArchitecture,
  createServerNextArchitecture
};
