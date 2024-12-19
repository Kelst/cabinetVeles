import axios from 'axios';

export const API_URL = `http://194.8.147.150:5000/api`;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const getAuthData = () => {
    const authData = localStorage.getItem('authData');
    return authData ? JSON.parse(authData) : null;
};

const setAuthData = (data) => {
    localStorage.setItem('authData', JSON.stringify(data));
};

const removeAuthData = () => {
    localStorage.removeItem('authData');
};

$api.interceptors.request.use((config) => {
    const authData = getAuthData();
    if (authData?.accessToken) {
        config.headers.Authorization = `Bearer ${authData.accessToken}`;
    }
    return config;
});

$api.interceptors.response.use(
    (response) => {
        // Якщо отримуємо нові токени, зберігаємо їх
        if (response.data.accessToken && response.data.refreshToken) {
            setAuthData(response.data);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const authData = getAuthData();
                if (!authData?.refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.get(`${API_URL}/refresh`, {
                    withCredentials: true
                });

                if (response.data.accessToken && response.data.refreshToken) {
                    setAuthData(response.data);
                    originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                    processQueue(null, response.data.accessToken);
                    return $api(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                removeAuthData();
                if (!window.location.pathname.includes('login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default $api;
