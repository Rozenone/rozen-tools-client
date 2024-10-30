import axios from 'axios';
import router from '@/router';

// 创建新的axios实例
const service = axios.create({
    // 环境变量
    baseURL: import.meta.env.VITE_URL,
    // 超时时间
    timeout: 100000,
});


//请求拦截器
service.interceptors.request.use(
    config => {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token
        const token = localStorage.getItem('token');
        if (token != null && token != '') {
            config.headers['token'] = token;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    })

// const router = useRouter();
// 响应拦截器
service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if ((response.data != null) && response.data.token != null && response.data.token != '') {
                localStorage.setItem('token', response.data.token);
            } else if (response.data.resultCode === 6000 || response.data.resultCode === 6001) {
                console.log('tokens失效!');
                localStorage.setItem('token', '');
                localStorage.setItem('auth', '');
                router.push('/login');
            }
            return response.data;
        }
    },
    // 服务器状态码不是200的情况
    error => {
        if (error.response.status != null && error.response.status) {
            switch (error.response.status) {
                case 500:
                    console.log('服务器内部错误！');
                    break
                case 404:
                    console.log('页面不存在！');
                    break
                // 其他错误，直接抛出错误提示
                default:
                    console.log(error.response.data.message);
            }
            return Promise.reject(error.response);
        }
    })

export default service 