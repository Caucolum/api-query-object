"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Test: () => test_default,
  createClientNextArchitecture: () => createClientNextArchitecture,
  createServerNextArchitecture: () => createServerNextArchitecture
});
module.exports = __toCommonJS(index_exports);

// src/components/test.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var Test = () => {
  const [counter, setCounter] = (0, import_react.useState)(0);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { backgroundColor: "red", cursor: "pointer" }, onClick: () => setCounter((prev) => prev + 1), children: [
    "este \xE9 um componente test ",
    counter
  ] });
};
var test_default = Test;

// src/axios/index.ts
var import_axios = __toESM(require("axios"));
var createConfiguredAxiosInstance = (options) => {
  const axiosInstance = import_axios.default.create({
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

// src/useServiceCall/index.tsx
var import_react2 = require("react");
var useServiceCall = ({ fn }) => {
  const [status, setStatus] = (0, import_react2.useState)("idle");
  const [args, setArgs] = (0, import_react2.useState)(null);
  const [error, setError] = (0, import_react2.useState)(null);
  const [data, setData] = (0, import_react2.useState)(null);
  const makeRequest = async (...args2) => {
    setStatus("loading");
    setArgs(args2);
    try {
      const response = await fn(...args2);
      setData(response);
      setStatus("loaded");
      return response;
    } catch (err) {
      setStatus("error");
      setError(err);
    }
  };
  return { data, status, error, args, makeRequest };
};
var useServiceCall_default = useServiceCall;

// src/index.ts
function createApiClass(list) {
  return class Api {
    constructor() {
      Object.keys(list).forEach((key) => {
        this[key] = async (params) => {
          return this.request(list[key].method, list[key].url, list[key].authenticated);
        };
      });
    }
    async request(method, url, authenticated) {
      const client = authenticated ? http_default.privateClient() : http_default.publicClient();
      const response = await client[method](url);
      return response.data;
    }
  };
}
function createPrimitiveClient(serverApi) {
  class PrimitiveClient {
    constructor() {
      Object.keys(serverApi).forEach((key) => {
        this[key] = () => {
          return useServiceCall_default({ fn: serverApi[key] });
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
  const PrimitiveClient = createPrimitiveClient(serverApi);
  const client = new PrimitiveClient();
  return client;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Test,
  createClientNextArchitecture,
  createServerNextArchitecture
});
