import axios from 'axios';
const production = process.env.NODE_ENV === 'production'
const token = decodeURIComponent(
    escape(window.atob(window.location.pathname.slice(16)))
);
const instance = axios.create({
    baseURL: production ? '/api' : 'https://cabinet.dev.opensky.biz/api',
    // baseURL: localStorage.getItem('baseUrl'),
    withCredentials: true
});
instance.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
