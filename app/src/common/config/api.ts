import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  // baseURL: "https://991xlcp5-3000.brs.devtunnels.ms",
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };
