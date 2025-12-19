// src/api/axios.js
import axios from "axios";
import { APP_URL } from "../constants/apiConstants";

const api = axios.create({
  baseURL: APP_URL,
  withCredentials: true, // 🔥 REQUIRED
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default api;

