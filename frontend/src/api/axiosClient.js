import axios from 'axios';

const axiosClient = axios.create({
    baseURL: '/api', // goes to http://localhost:5000 via Vite proxy
});

export default axiosClient;
