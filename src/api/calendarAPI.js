import axios from "axios";
import { getEnvVariables } from "../helpers";

const env = getEnvVariables();

const calendarAPI = axios.create({
  baseURL: env.VITE_API_URL,
});

calendarAPI.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    "x-token": localStorage.getItem("token"),
  };
  console.log(config);
  return config;
});

export default calendarAPI;
