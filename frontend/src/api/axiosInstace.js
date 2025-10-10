import axios from "axios";
import { serverUrl } from "../pages/global";

let url = serverUrl;

const instance = axios.create({
  baseURL: url +"/api", // Backend root URL
});

export default instance;
