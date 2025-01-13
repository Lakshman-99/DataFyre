import axios from "axios";

// Create an Axios instance with a base URL
const axios_base = axios.create({
    baseURL: "https://datafyre.onrender.com/api/v1/",
});

export default axios_base;