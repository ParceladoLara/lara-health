import axios from "axios";

const api = axios.create({
  baseURL: "https://example-erp-api.parceladolara.com.br",
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };
