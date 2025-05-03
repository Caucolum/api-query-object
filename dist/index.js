"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createClientNextArchitecture: () => createClientNextArchitecture,
  createServerNextArchitecture: () => createServerNextArchitecture
});
module.exports = __toCommonJS(index_exports);

// src/useServiceCall/index.tsx
var import_react = require("react");
var useServiceCall = ({ fn, resources }) => {
  const onSuccess = resources?.onSuccess;
  const onError = resources?.onError;
  const [status, setStatus] = (0, import_react.useState)("idle");
  const [error, setError] = (0, import_react.useState)(null);
  const [data, setData] = (0, import_react.useState)(null);
  const [args, setArgs] = (0, import_react.useState)(null);
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
function createServerNextArchitecture(list, axiosConfig, axiosInstance) {
  const PrimitiveServer = createApiClass(list, axiosConfig, axiosInstance);
  const server = new PrimitiveServer();
  return server;
}
function createClientNextArchitecture(serverApi, list) {
  const PrimitiveClient = createPrimitiveClient(serverApi, list);
  const client = new PrimitiveClient();
  return client;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createClientNextArchitecture,
  createServerNextArchitecture
});
