import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Backend root URL
});

export default instance;
