// src/useServiceCall/index.tsx
import { useState } from "react";
var useServiceCall = ({ fn, config }) => {
  const [status, setStatus] = useState("idle");
  const [args, setArgs] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const redirector = config?.redirector;
  const makeRequest = async (...args2) => {
    setStatus("loading");
    setArgs(args2[0]);
    try {
      const response = await fn(...args2);
      setData(response);
      setStatus("loaded");
      if (redirector) {
        window.location.href = redirector;
      }
    } catch (err) {
      setStatus("error");
      setError(err);
    }
  };
  return { data, status, error, args, makeRequest };
};
var useServiceCall_default = useServiceCall;

// src/axios/index.ts
import axios from "axios";
var createConfiguredAxiosInstance = (options) => {
  const axiosInstance = axios.create({
    ...options,
    baseURL: options.url,
    headers: {
      "Content-Type": "application/json"
    }
  });
  axiosInstance.interceptors.request.use(
    (config) => {
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
  publicClient() {
    return createConfiguredAxiosInstance({
      url: "",
      withBearerToken: false
    });
  }
  privateClient() {
    return createConfiguredAxiosInstance({
      url: "",
      withBearerToken: true
    });
  }
};
var http = new Http();
var http_default = http;

// src/index.ts
function createApiClass(list) {
  return class Api {
    constructor() {
      Object.keys(list).forEach((key) => {
        this[key] = async (params) => {
          return this.request(list[key].method, list[key].url, list[key].authenticated, params);
        };
      });
    }
    async request(method, url, authenticated, params) {
      const client = authenticated ? http_default.privateClient() : http_default.publicClient();
      const response = await client[method](url, { params });
      return response.data;
    }
  };
}
function createPrimitiveClient(serverApi, list) {
  class PrimitiveClient {
    constructor() {
      Object.keys(serverApi).forEach((key) => {
        const redirector = list[key]?.redirector;
        this[key] = () => {
          return useServiceCall_default({ fn: serverApi[key], config: { redirector } });
        };
      });
    }
  }
  return PrimitiveClient;
}
function createServerNextArchitecture(list) {
  const PrimitiveServer = createApiClass(list);
  const server = new PrimitiveServer();
  return server;
}
function createClientNextArchitecture(serverApi, list) {
  const PrimitiveClient = createPrimitiveClient(serverApi, list);
  const client = new PrimitiveClient();
  return client;
}
export {
  createClientNextArchitecture,
  createServerNextArchitecture
};
