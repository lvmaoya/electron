import axios from 'axios';

// 创建 Axios 实例
const service = axios.create({
  baseURL: '/api', // 设置基础URL
  timeout: 5000, // 设置请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 例如添加 token 到请求头
    // config.headers['Authorization'] = 'Bearer ' + token;
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做些什么
    return response.data;
  },
  error => {
    // 对响应错误做些什么
    return Promise.reject(error);
  }
);

export default service;