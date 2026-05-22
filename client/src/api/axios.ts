// src/api/axios.ts

import axios from "axios";

const api = axios.create({
  baseURL: "http://13.238.171.190:8080/api/v1",
  withCredentials: true,
});

export default api;
